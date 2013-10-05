using System;
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
            var entity = this.Repository.Find(codeid);
            var model = new ViewModel
            {
                Code = Encoding.UTF8.GetString(entity.CodeAsBytes),
                GraphicDataURL = "data:image/jpeg;base64," + Convert.ToBase64String(entity.Graphic)
            };
            return View(model);
        }

        public ActionResult Thumbnail(string id)
        {
            var entity = this.Repository.Find(CodeId.FromRowKey(id));
            if (entity == null) return new EmptyResult();
            return new FileContentResult(entity.Thumbnail, "image/png");
            //return new CacheableContentResult("image/png", () => entity.Graphic, entity.Timestamp, entity.RowKey);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            this.Repository.Dispose();
        }
    }
}
