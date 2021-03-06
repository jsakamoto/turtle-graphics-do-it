﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using TurtleGraphicsDoIt.Models;
using Toolbelt.Web;

namespace TurtleGraphicsDoIt.Controllers
{
    public class PublishedController : Controller
    {
        public Repository Repository { get; set; }

        public PublishedController()
        {
            this.Repository = new Repository();
        }

        public ActionResult Index()
        {
            var model = this.Repository.GetAllRowKeys();
            return View(model);
        }

        public ActionResult Detail(string id)
        {
            var codeid = CodeId.FromRowKey(id);
            
            var allRowKeys = this.Repository.GetAllRowKeys().ToArray(); // Sorted by date time desc.
            var prevRowKey = allRowKeys.Reverse().SkipWhile(rowKey => rowKey != codeid.RowKey).Skip(1).FirstOrDefault() ?? "";
            var nextRowKey = allRowKeys.SkipWhile(rowKey => rowKey != codeid.RowKey).Skip(1).FirstOrDefault() ?? "";

            var entity = this.Repository.Find(codeid);
            var model = new ViewModel
            {
                Code = Encoding.UTF8.GetString(entity.CodeAsBytes),
                GraphicDataURL = "data:image/jpeg;base64," + Convert.ToBase64String(entity.Graphic),
                PrevRowKey = prevRowKey,
                NextRowKey = nextRowKey
            };
            return View(model);
        }

        public ActionResult Thumbnail(string id)
        {
            return new CacheableContentResult("image/png", () =>
                {
                    var entity = this.Repository.Find(CodeId.FromRowKey(id));
                    return entity != null ? entity.Thumbnail : new byte[0];
                },
                cacheability: HttpCacheability.ServerAndPrivate,
                etag: id);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            this.Repository.Dispose();
        }
    }
}
