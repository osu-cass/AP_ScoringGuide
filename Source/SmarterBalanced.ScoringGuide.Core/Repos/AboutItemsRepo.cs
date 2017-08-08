using Microsoft.Extensions.Logging;
using SmarterBalanced.SampleItems.Dal.Providers;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmarterBalanced.ScoringGuide.Core.Repos
{
    public class AboutItemsRepo
    {
        private readonly SampleItemsContext context;
        private readonly ILogger logger;


        public AboutItemsRepo(SampleItemsContext context, ILoggerFactory loggerFactory)
        {
            this.context = context;
            logger = loggerFactory.CreateLogger<AboutItemsRepo>();
        }
        private AboutThisItem GetAboutThisItem(SampleItem sampleItem)
        {
            if (sampleItem == null)
            {
                return null;
            }

            var itemCardViewModel = GetItemCardViewModel(sampleItem.BankKey, sampleItem.ItemKey);
            var aboutThisItemViewModel = new AboutThisItem(
                rubrics: sampleItem.Rubrics,
                itemCard: itemCardViewModel,
                targetDescription: sampleItem.CoreStandards?.TargetDescription,
                depthOfKnowledge: sampleItem.DepthOfKnowledge,
                commonCoreStandardsDescription: sampleItem.CoreStandards?.CommonCoreStandardsDescription);

            return aboutThisItemViewModel;
        }

        private ItemCardViewModel GetItemCardViewModel(int bankKey, int itemKey)
        {
            return context.ItemCards.SingleOrDefault(item => item.BankKey == bankKey && item.ItemKey == itemKey);
        }

        public AboutThisItem GetAboutThisItem(int itemBank, int itemKey)
        {
            var sampleItem = context.SampleItems.FirstOrDefault(s => s.ItemKey == itemKey && s.BankKey == itemBank);
            if (sampleItem == null)
            {
                throw new Exception($"invalid request for {itemBank}-{itemKey}");
            }

            var aboutThis = GetAboutThisItem(sampleItem);

            return aboutThis;
        }
    }
}
