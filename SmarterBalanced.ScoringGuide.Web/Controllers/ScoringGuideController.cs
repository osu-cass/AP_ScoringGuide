using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class ScoringGuideController : Controller
    {
        // GET: /ScoringGuide/
        public IActionResult Index()
        {
            return View();
        }
    }
}
