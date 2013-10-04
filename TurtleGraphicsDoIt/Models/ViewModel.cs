using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TurtleGraphicsDoIt.Models
{
    public class ViewModel
    {
        [AllowHtml]
        public string Code { get; set; }

        public string GraphicDataURL { get; set; }
    }
}