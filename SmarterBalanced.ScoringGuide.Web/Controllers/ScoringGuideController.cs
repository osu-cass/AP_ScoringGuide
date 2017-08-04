﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SmarterBalanced.ScoringGuide.Core.Repos;

namespace SmarterBalanced.ScoringGuide.Web.Controllers
{
    public class ScoringGuideController : Controller
    {
        private IScoringRepo scoringRepo;
        public ScoringGuideController(IScoringRepo scoringRepo)
        {
            this.scoringRepo = scoringRepo;
        }
        public IActionResult Search(int bankKey, int itemKey)
        {
            var item = scoringRepo.GetItemCard(bankKey, itemKey);
            return Json(item);
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
