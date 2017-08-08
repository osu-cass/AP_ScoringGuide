using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmarterBalanced.ScoringGuide.Core.Repos
{
    public interface IScoringRepo
    {
        ItemCardViewModel GetItemCard(int bankKey, int itemKey);

        List<ItemCardViewModel> GetItemCards();
        List<ItemCardViewModel> GetItemCards(ScoreSearchParams scoreParams);

        AboutThisItem GetAboutThisItem(int itemBank, int itemKey);

    }
}
