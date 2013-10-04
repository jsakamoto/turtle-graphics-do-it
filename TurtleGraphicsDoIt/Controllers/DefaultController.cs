using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using TurtleGraphicsDoIt.Models;

namespace TurtleGraphicsDoIt.Controllers
{
    public class DefaultController : Controller
    {
        public Repository Repository { get; set; }

        public DefaultController()
        {
            this.Repository = new Repository();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Publish(ViewModel model)
        {
            // Save to storage and redirect to '/Published/{id}'.
            var codeid = CodeId.FromCode(model.Code);
            var entity = new Entity
            {
                PartitionKey = codeid.PartitionKey,
                RowKey = codeid.RowKey,
                CodeAsBytes = Encoding.UTF8.GetBytes(model.Code),
                Graphic = Convert.FromBase64String(model.GraphicDataURL.Split(',').Last())
            };
            this.Repository.Add(entity);

            return RedirectToAction("Published", new { id = codeid.RowKey });
        }

        public ActionResult Published(string id)
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

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            this.Repository.Dispose();
        }
    }
}
