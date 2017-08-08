using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Error()
        {
            return View();
        }

        public IActionResult StatusCodeError(int? code)
        {
            ViewData["Error"] = "Something went wrong";

            if ((int)HttpStatusCode.BadRequest == code.GetValueOrDefault())
            {
                ViewData["Error"] = "400 Bad Request";
            }
            if ((int)HttpStatusCode.NotFound == code.GetValueOrDefault())
            {
                ViewData["Error"] = "404 Not Found";
            }
            if ((int)HttpStatusCode.Forbidden == code.GetValueOrDefault())
            {
                ViewData["Error"] = "403 Forbidden";
            }

            return View();
        }

        public IActionResult BrowserWarning()
        {
            ViewData["ReturnUrl"] = Request.Headers["Referer"].ToString();

            return View();
        }
    }
}
