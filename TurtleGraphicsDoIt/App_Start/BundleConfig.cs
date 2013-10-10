using System.Web;
using System.Web.Optimization;

namespace TurtleGraphicsDoIt
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/commons").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/html5-detectoffline.js"));

            bundles.Add(new ScriptBundle("~/bundles/default-index").Include(
                        "~/Scripts/html5-appcache.js",
                        "~/Scripts/sandbox.js",
                        "~/turtle-graphics.js",
                        "~/turtle-graphics-doit.js"));
        }
    }
}