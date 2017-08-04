using SmarterBalanced.SampleItems.Dal.Providers.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmarterBalanced.ScoringGuide.Core.Repos.Models
{
    public class ScoreSearchParams
    {
        public GradeLevels Grades { get; }
        public IList<string> Subjects { get; }
        public IList<string> TechType { get; }
        public ScoreSearchParams(GradeLevels gradeLevels, string[] subjects, string[] techType)
        {
            Grades = gradeLevels;
            Subjects = subjects;
            TechType = techType;
        }
    }

}
