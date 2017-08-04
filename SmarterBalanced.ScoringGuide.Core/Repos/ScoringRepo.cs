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
            var query = context.ItemCards.Where(i => i.Grade != GradeLevels.NA && !i.BrailleOnlyItem);

            if(scoreParams == null)
            {
                return query.ToList();
            }

            if (scoreParams.Grades != GradeLevels.All && scoreParams.Grades != GradeLevels.NA)
            {
                query = query.Where(i => scoreParams.Subjects.Contains(i.SubjectCode));
            }

            //TODO: what is CAT technology? filter? ignore?
            if (scoreParams.TechType.Any(t => t.ToLower() == "pt"))
            {
                query = query.Where(i => i.IsPerformanceItem);
            }

            return query.OrderBy(i => i.SubjectCode).ThenBy(i => i.Grade).ThenBy(i => i.ClaimCode).ToList();
        }
    }
}
