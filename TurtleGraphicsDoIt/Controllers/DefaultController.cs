using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
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

        public ActionResult Index(string id)
        {
            var model = default(ViewModel);
            if (string.IsNullOrWhiteSpace(id) == false)
            {
                var entity = this.Repository.Find(CodeId.FromRowKey(id));
                if (entity != null)
                {
                    model = new ViewModel { 
                        Code = Encoding.UTF8.GetString(entity.CodeAsBytes)
                    };
                }
            }
            return View(model);
        }

        public ActionResult Publish(ViewModel model)
        {
            // Save to storage and redirect to '/Published/{id}'.
            var codeid = CodeId.FromCode(model.Code);

            const int thumbnailSize = 120;
            var graphbin = Convert.FromBase64String(model.GraphicDataURL.Split(',').Last());
            var thumbbin = default(byte[]);
            using(var ms1 = new MemoryStream(graphbin)) 
            using(var ms2 = new MemoryStream()){
                var png = Image.FromStream(ms1);
                var thumbnail = new Bitmap(thumbnailSize, thumbnailSize);
                using (var g = Graphics.FromImage(thumbnail))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.DrawImage(png, 0, 0, 120, 120);
                }
                thumbnail.Save(ms2, ImageFormat.Png);
                thumbbin = ms2.GetBuffer();
            }

            var entity = new Entity
            {
                PartitionKey = codeid.PartitionKey,
                RowKey = codeid.RowKey,
                CodeAsBytes = Encoding.UTF8.GetBytes(model.Code),
                Graphic = graphbin,
                Thumbnail = thumbbin
            };
            this.Repository.Add(entity);

            return RedirectToAction("Detail", "Published", new { id = codeid.RowKey });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            this.Repository.Dispose();
        }
    }
}
