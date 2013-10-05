using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Table.DataServices;

namespace TurtleGraphicsDoIt.Models
{
    public class Repository : IDisposable
    {
        protected const string _TableName = "codes";

        protected TableServiceContext _Context;

        public Repository()
        {
            var appSettings = ConfigurationManager.AppSettings;

            var credentials = new StorageCredentials(
                appSettings["StorageAccount.Name"],
                appSettings["StorageAccount.Key"]);
            var storageAccount = new CloudStorageAccount(credentials, useHttps: true);
            var tableClient = storageAccount.CreateCloudTableClient();
            var tableRef = tableClient.GetTableReference(_TableName);
            tableRef.CreateIfNotExists();
            _Context = tableClient.GetTableServiceContext();
        }

        public void Add(Entity entity)
        {
            _Context.AddObject(_TableName, entity);
            _Context.SaveChanges();
        }

        public Entity Find(CodeId codeid)
        {
            var entity = _Context
                .CreateQuery<Entity>(_TableName)
                .Where(e => e.PartitionKey == codeid.PartitionKey && e.RowKey == codeid.RowKey)
                .FirstOrDefault();
            return entity;
        }

        public IEnumerable<string> GetAllRowKeys()
        {
            return _Context
                .CreateQuery<TableEntity>(_TableName)
                .ToList()
                .OrderByDescending(e => e.Timestamp)
                .Select(e => e.RowKey);
        }

        public void Dispose()
        {
            if (_Context != null) _Context.Dispose();
        }
    }
}