using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Table.DataServices;

namespace TurtleGraphicsDoIt.Models
{
    public class Entity : TableServiceEntity
    {
        public byte[] CodeAsBytes { get; set; }

        public byte[] Graphic { get; set; }

        public byte[] Thumbnail { get; set; }
    }
}