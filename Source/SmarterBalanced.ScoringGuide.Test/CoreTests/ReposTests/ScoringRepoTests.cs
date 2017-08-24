using Microsoft.Extensions.Logging;
using Moq;
using SmarterBalanced.ScoringGuide.Core.Repos;
using SmarterBalanced.ScoringGuide.Core.Repos.Models;
using SmarterBalanced.SampleItems.Dal.Providers;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Xunit;

namespace SmarterBalanced.ScoringGuide.Test.CoreTests.ReposTests
{
    public class SampleItemsSearchRepoTests
    {
        ScoringRepo ScoringRepo;
        int GoodItemKey;
        int GoodBankKey;
        int BadItemKey;
        int BadBankKey;
        SampleItemsContext Context;
        Claim Claim1, Claim2;
        Subject Math, Ela;
        InteractionType ItEla, ItMath;
        public SampleItemsSearchRepoTests()
        {
            GoodItemKey = 2343;
            GoodBankKey = 8398;
            BadItemKey = 9234;
            BadBankKey = 1123;
            Claim1 = new Claim(
                "claim1",
                "1",
                "ELA Claim 1",
                ImmutableArray.Create<Target>());
            Claim2 = new Claim(
                "claim2",
                "2",
                "Math Claim 1",
                ImmutableArray.Create<Target>());
            ItMath = new InteractionType("2", "Math Itype", "", 2);
            ItEla = new InteractionType("1", "Ela Itype", "", 1);
            Math = Subject.Create("Math", "Mathematics", "Math", ImmutableArray.Create(Claim2), ImmutableArray.Create(ItMath.Code));
            Ela = Subject.Create("ELA", "English", "ELA", ImmutableArray.Create(Claim1), ImmutableArray.Create(ItEla.Code));
            var interactionTypes = ImmutableArray.Create(ItEla, ItMath);
            var subjects = ImmutableArray.Create(Ela, Math);
            var itemCards = ImmutableArray.Create(
                        ItemCardViewModel.Create(bankKey: GoodBankKey, itemKey: GoodItemKey, grade: GradeLevels.Grade6,
                                                 subjectCode: Math.Code, interactionTypeCode: ItMath.Code, claimCode: Claim1.Code),
                        ItemCardViewModel.Create(bankKey: GoodBankKey, itemKey: BadItemKey, grade: GradeLevels.High,
                                                 subjectCode: Math.Code, interactionTypeCode: ItMath.Code, claimCode: Claim2.Code),
                        ItemCardViewModel.Create(bankKey: BadBankKey, itemKey: GoodItemKey, grade: GradeLevels.Grade9,
                                                 subjectCode: Ela.Code, interactionTypeCode: ItEla.Code, claimCode: Claim1.Code),
                        ItemCardViewModel.Create(bankKey: BadBankKey, itemKey: BadItemKey, grade: GradeLevels.Grade4,
                                                 subjectCode: Ela.Code, interactionTypeCode: ItEla.Code, claimCode: Claim2.Code),
                        ItemCardViewModel.Create(bankKey: 1, itemKey: 2, grade: GradeLevels.Grade12)
                );
            Context = SampleItemsContext.Create(itemCards: itemCards, subjects: subjects, interactionTypes: interactionTypes);

            var loggerFactory = new Mock<ILoggerFactory>();
            var logger = new Mock<ILogger>();
            loggerFactory.Setup(lf => lf.CreateLogger(It.IsAny<string>())).Returns(logger.Object);

            ScoringRepo = new ScoringRepo(Context, loggerFactory.Object);
        }

        private void AssertItemCardListsEqual(IList<ItemCardViewModel> cards1, IList<ItemCardViewModel> cards2)
        {
            foreach (var card in cards1)
            {
                try { cards2.Remove(card); }
                catch { }
            }
            if (cards2.Any())
            {
                throw new System.Exception("Lists not equal");
            }
        }

        private List<ItemCardViewModel> Sort(IList<ItemCardViewModel> cardsList)
        {
            return cardsList.OrderBy(c => c.BankKey).ThenBy(c => c.ItemKey).ToList();
        }

        #region GetItemCards

        #endregion
        [Fact]
        public void HappyCase()
        {
            Assert.Equal(Context.ItemCards.Count(), ScoringRepo.GetItemCards().Count);
        }

        [Fact]
        public void TestGetItemCards()
        {
            var parameters = new ScoreSearchParams(GradeLevels.All, new string[] { }, new string[] { Claim1.Code }, false);
            var cards = ScoringRepo.GetItemCards(parameters);
            Assert.NotNull(cards);
        }

        [Fact]
        public void TestGetItemCardsAll()
        {
            var cards = ScoringRepo.GetItemCards();
            Assert.NotNull(cards);
            Assert.Equal(cards.Count, Context.ItemCards.Count());
        }

        [Fact]
        public void TestGetItemCardsMultipleGrade()
        {
            var parameters = new ScoreSearchParams(GradeLevels.Grade9 | GradeLevels.Grade4, new string[] { }, new string[] { }, false);
            var cards = ScoringRepo.GetItemCards(parameters);
            var cardsCheck = Context.ItemCards.Where(c => c.Grade == GradeLevels.Grade9 || c.Grade == GradeLevels.Grade4
                                                        || c.Grade == GradeLevels.Elementary || c.Grade == GradeLevels.High).ToList();

            Assert.NotNull(cards);
            Assert.Equal(cards.Count, 3);
            Assert.Equal(Sort(cards), Sort(cardsCheck));
        }

        [Fact]
        public void TestGetItemCardsClaimNoSubject()
        {
            var parameters = new ScoreSearchParams(GradeLevels.All, new string[] { }, new string[] { Claim2.Code }, false);
            var cards = ScoringRepo.GetItemCards(parameters);
            Assert.NotNull(cards);
            Assert.Equal(Context.ItemCards.Count(), cards.Count);
            Assert.Equal(Sort(Context.ItemCards), Sort(cards));
        }

        [Fact(Skip ="TODO: What is CAT?")]
        public void TestGetItemCardsSubjectAndInteraction()
        {
            var parameters = new ScoreSearchParams(GradeLevels.All, new string[] { ItMath.Code }, new string[] { }, false);
            var cards = ScoringRepo.GetItemCards(parameters);
            var cardsCheck = Context.ItemCards.Where(c => c.SubjectCode == Math.Code && c.InteractionTypeCode == ItMath.Code).ToList();

            Assert.NotNull(cards);
            Assert.Equal(cardsCheck.Count, cards.Count);
            Assert.Equal(Sort(cardsCheck), Sort(cards));
        }

    }
}