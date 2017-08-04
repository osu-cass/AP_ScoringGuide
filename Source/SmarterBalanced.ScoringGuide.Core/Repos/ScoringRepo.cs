using System;
using System.Collections.Generic;
using System.Text;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using SmarterBalanced.SampleItems.Dal.Providers;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace SmarterBalanced.ScoringGuide.Core.Repos
{
    public class ScoringRepo : IScoringRepo
    {
        private readonly SampleItemsContext context;
        private readonly ILogger logger;
        public ScoringRepo(SampleItemsContext context, ILoggerFactory loggerFactory)
        {
            this.context = context;
            logger = loggerFactory.CreateLogger<ScoringRepo>();
        }

        public ItemCardViewModel GetItemCard(int bankKey, int itemKey)
        {
            return context.ItemCards.SingleOrDefault(i => i.BankKey == bankKey && i.ItemKey == itemKey);
        }

        public List<ItemCardViewModel> GetItemCards()
        {
            return context.ItemCards.ToList();
        }

        public List<ItemCardViewModel> GetItemCards(ScoreSearchParams scoreParams)
        {
            throw new NotImplementedException();
        }
    }
}
