using SmarterBalanced.ScoringGuide.Core.Repos;
using SmarterBalanced.ScoringGuide.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Text;
using Moq;
using SmarterBalanced.SampleItems.Dal.Providers;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using Microsoft.Extensions.Logging;

namespace SmarterBalanced.ScoringGuide.Test.WebTests.ControllerTests
{
    public class ScoringGuideControllerTests
    {
        ScoringGuideController scoringGuideController;
        private const int goodBankKey = 5;
        private const int goodItemKey = 2;
        private const int badBankKey = 10;
        private const int badItemKey = 10;
        private const GradeLevels gradeLevels =  GradeLevels.All;
        private const string[] subject = null;
        private const string[] techType = null;
        private const bool braille = false;
        public ScoringGuideControllerTests()
        {
            var itemCard = ItemCardViewModel.Create(bankKey: goodBankKey, itemKey: goodItemKey);
            var defaultAboutThisItem = AboutThisItem.Create(itemCard: itemCard);
            var scoringRepoMock = new Mock<IScoringRepo>();

            scoringRepoMock.Setup(i => i.GetAboutThisItem(It.IsAny<int>(), It.IsAny<int>())).Throws(new Exception());
            scoringRepoMock.Setup(i => i.GetAboutThisItem(goodBankKey, goodItemKey)).Returns(defaultAboutThisItem);

            scoringRepoMock.Setup(i => i.GetItemCards(gradeLevels, subject, techType, braille)).Returns(new List<ItemCardViewModel>());

            var loggerFactory = new Mock<ILoggerFactory>();
            var logger = new Mock<ILogger>();
            loggerFactory.Setup(lf => lf.CreateLogger(It.IsAny<string>())).Returns(logger.Object);

            scoringGuideController = new ScoringGuideController(scoringRepoMock.Object, loggerFactory.Object);
        }

        [Fact]
        public void TestAboutThisItemGood()
        {
            var result = scoringGuideController.AboutThisItem(goodBankKey, goodItemKey);
            JsonResult resJson = Assert.IsType<JsonResult>(result);
            var model = Assert.IsType<AboutThisItem>(resJson.Value);
        }

        [Fact]
        public void TestAboutThisItemBadBankKey()
        {
            var result = scoringGuideController.AboutThisItem(badBankKey, goodItemKey);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void TestAboutThisItemBadNulls()
        {
            var result = scoringGuideController.AboutThisItem(null, null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void TestAboutThisItemBadNullBankKey()
        {
            var result = scoringGuideController.AboutThisItem(null, goodItemKey);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void TestAboutThisItemBadNullItemKey()
        {
            var result = scoringGuideController.AboutThisItem(goodBankKey, null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void TestAboutThisItemBadItemKey()
        {
            var result = scoringGuideController.AboutThisItem(goodBankKey, badItemKey);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void TestSearchGood()
        {
            var result = scoringGuideController.Search(gradeLevels, subject, techType, braille);
            JsonResult resJson = Assert.IsType<JsonResult>(result);
            var models = Assert.IsType<List<ItemCardViewModel>>(resJson.Value);
        }
    }
}
