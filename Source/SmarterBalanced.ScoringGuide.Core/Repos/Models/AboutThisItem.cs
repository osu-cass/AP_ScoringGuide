using SmarterBalanced.SampleItems.Dal.Providers.Models;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Text;

namespace SmarterBalanced.ScoringGuide.Core.Repos.Models
{
    public class AboutThisItem
    {
        public ItemCardViewModel ItemCardViewModel { get; }
        public ImmutableArray<Rubric> Rubrics { get; }
        public string TargetDescription { get; }
        public string DepthOfKnowledge { get; }
        public string CommonCoreStandardsDescription { get; }

        public AboutThisItem(
            ImmutableArray<Rubric> rubrics,
            ItemCardViewModel itemCard,
            string targetDescription,
            string depthOfKnowledge,
            string commonCoreStandardsDescription)
        {
            ItemCardViewModel = itemCard;
            Rubrics = rubrics;
            TargetDescription = targetDescription;
            DepthOfKnowledge = depthOfKnowledge;
            CommonCoreStandardsDescription = commonCoreStandardsDescription;
        }
    }
}
