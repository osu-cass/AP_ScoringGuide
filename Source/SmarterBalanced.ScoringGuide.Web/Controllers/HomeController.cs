using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.Extensions.Logging;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger logger;
        public HomeController(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<HomeController>();
        }
        public IActionResult Error()
        {
            logger.LogError($"{nameof(Error)} Error not caught");
            return View();
        }

        public IActionResult StatusCodeError(int? code)
        {
            logger.LogError($"{nameof(StatusCodeError)} Error {code}");

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
