using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmarterBalanced.ScoringGuide.Core.Repos;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using Microsoft.Extensions.Logging;

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class ScoringGuideController : Controller
    {
        private readonly IScoringRepo scoringRepo;
        private readonly ILogger logger;
        public ScoringGuideController(IScoringRepo scoringRepo, ILoggerFactory loggerFactory)
        {
            this.scoringRepo = scoringRepo;
            logger = loggerFactory.CreateLogger<ScoringGuideController>();

        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AboutThisItem(int? bankKey, int? itemKey)
        {
            if (!bankKey.HasValue || !itemKey.HasValue)
            {
                logger.LogWarning($"{nameof(AboutThisItem)} null param(s), given {bankKey} {itemKey}");
                return BadRequest();
            }

            AboutThisItem aboutThis;
            try
            {
                aboutThis = scoringRepo.GetAboutThisItem(bankKey.Value, itemKey.Value);
            }
            catch (Exception e)
            {
                logger.LogWarning($"{nameof(AboutThisItem)} invalid request: {e.Message}");
                return BadRequest();
            }

            if (aboutThis == null)
            {
                logger.LogWarning($"{nameof(AboutThisItem)} incorrect param(s), given {bankKey} {itemKey}");
                return BadRequest();
            }

            return Json(aboutThis);

        }
        public IActionResult Search(GradeLevels gradeLevels, string[] subject, string[] techType, bool braille)
        {
            var items = scoringRepo.GetItemCards(gradeLevels, subject, techType, braille);
            return Json(items);
        }
    }
}
