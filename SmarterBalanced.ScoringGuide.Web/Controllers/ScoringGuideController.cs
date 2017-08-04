using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmarterBalanced.ScoringGuide.Core.Repos;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class ScoringGuideController : Controller
    {
        private IScoringRepo scoringRepo;
        public ScoringGuideController(IScoringRepo scoringRepo)
        {
            this.scoringRepo = scoringRepo;
        }
        public IActionResult Search(GradeLevels gradeLevels, string[] subject, string[] techType)
        {
            var searchParams = new ScoreSearchParams(gradeLevels, subject, techType);
            var items = scoringRepo.GetItemCards(searchParams);
            return Json(items);
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
