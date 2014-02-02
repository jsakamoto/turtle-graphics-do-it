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

        private CloudTable _TableRef;

        protected CloudTable TableRef {
            get {
                if (_TableRef == null) _TableRef = GetTableRef();
                return _TableRef;
            }
        }

        public Repository()
        {
        }

        private CloudTable GetTableRef()
        {
            var appSettings = ConfigurationManager.AppSettings;

            var storageAccount = CloudStorageAccount.Parse(appSettings["StorageAccount"] ?? "UseDevelopmentStorage=true");
            var tableClient = storageAccount.CreateCloudTableClient();
            var tableRef = tableClient.GetTableReference(_TableName);
            tableRef.CreateIfNotExists();

            return tableRef;
        }

        public void Add(Entity entity)
        {
            var op = TableOperation.Retrieve(entity.PartitionKey, entity.RowKey);
            var result = TableRef.Execute(op);
            if (result.Result == null)
            {
                TableRef.Execute(TableOperation.Insert(entity));
            }
            else
            {
                entity.ETag = "*";
                var updateOp = TableOperation.Replace(entity);
                TableRef.Execute(updateOp);
            }
        }

        public Entity Find(CodeId codeid)
        {
            var op = TableOperation.Retrieve<Entity>(codeid.PartitionKey, codeid.RowKey);
            var result = TableRef.Execute(op);
            return result.Result as Entity;
        }

        public IEnumerable<string> GetAllRowKeys()
        {
            var query = new TableQuery().Select(new string[] { });
            return TableRef
                .ExecuteQuery(query)
                .OrderByDescending(a => a.Timestamp)
                .Select(a => a.RowKey);
        }

        public void Dispose()
        {
        }
    }
}