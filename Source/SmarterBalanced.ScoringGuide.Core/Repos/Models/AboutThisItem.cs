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
        public string EducationalDifficulty { get; }
        public string EvidenceStatement { get; }

        public AboutThisItem(
            ImmutableArray<Rubric> rubrics,
            ItemCardViewModel itemCard,
            string targetDescription,
            string depthOfKnowledge,
            string commonCoreStandardsDescription,
            string educationalDifficulty,
            string evidenceStatement)
        {
            ItemCardViewModel = itemCard;
            Rubrics = rubrics;
            TargetDescription = targetDescription;
            DepthOfKnowledge = depthOfKnowledge;
            CommonCoreStandardsDescription = commonCoreStandardsDescription;
            EducationalDifficulty = educationalDifficulty;
            EvidenceStatement = evidenceStatement;
        }

        public static AboutThisItem Create(
          ImmutableArray<Rubric> rubrics = new ImmutableArray<Rubric>(),
          ItemCardViewModel itemCard = null,
          string targetDescription = "",
          string depthOfKnowledge = "",
          string commonCoreStandardsDescription = "",
          string educationalDifficulty = "",
          string evidenceStatement = "")
        {

            return new AboutThisItem
            (
                rubrics: rubrics,
                itemCard: itemCard,
                targetDescription: targetDescription,
                depthOfKnowledge: depthOfKnowledge,
                commonCoreStandardsDescription: commonCoreStandardsDescription,
                educationalDifficulty: educationalDifficulty,
                evidenceStatement: evidenceStatement
            );
    }


    }
}
