using SmarterBalanced.SampleItems.Dal.Configurations.Models;
using SmarterBalanced.SampleItems.Dal.Providers;
using SmarterBalanced.SampleItems.Dal.Providers.Models;
using SmarterBalanced.SampleItems.Dal.Xml.Models;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Text;
using Xunit;
namespace SmarterBalanced.ScoringGuide.Test.CoreTests.ReposTests
{
    public class SearchRepoTest
    {
        SampleItem MathDigest, ElaDigest, DuplicateDigest, PerformanceDigest, PerformanceDigestDuplicate, BrailleItem, BrailleItemDuplicate, BrailleItemReplace;

        Subject Math, Ela, NotASubject;
        Claim Claim1, Claim2;
        ImmutableArray<SampleItem> SampleItems;
        ScoringRepo ScoringRepo;
        SampleItemsContext Context;
        FieldTestUse fieldTestUseVar;
        int GoodItemKey;
        int BadItemKey;
        int GoodBankKey;
        int BadBankKey;
        int DuplicateItemKey, DuplicateBankKey;
        ItemCardViewModel MathCard, ElaCard, DuplicateCard;
        //public SearchRepoTest()
        //{
        //    GoodBankKey = 1;
        //    BadBankKey = 3;
        //    BadItemKey = 9;
        //    GoodItemKey = 4;
        //    DuplicateBankKey = 5;
        //    DuplicateItemKey = 6;
        //    MathCard = ItemCardViewModel.Create(bankKey: GoodBankKey, itemKey: GoodItemKey);
        //    ElaCard = ItemCardViewModel.Create(bankKey: BadBankKey, itemKey: BadItemKey);
        //    DuplicateCard = ItemCardViewModel.Create(bankKey: DuplicateBankKey, itemKey: DuplicateItemKey);
        //    MathDigest = SampleItem.Create(bankKey: GoodBankKey, itemKey: GoodItemKey);
        //    ElaDigest = SampleItem.Create(bankKey: BadBankKey, itemKey: BadItemKey);

        //    fieldTestUseVar = new FieldTestUse();
        //    fieldTestUseVar.Code = "ELA";
        //    fieldTestUseVar.QuestionNumber = 1;

        //    DuplicateDigest = SampleItem.Create(bankKey: GoodBankKey, itemKey: DuplicateItemKey);
        //    var duplicateDigest2 = SampleItem.Create(bankKey: GoodBankKey, itemKey: DuplicateItemKey);

        //    PerformanceDigest = SampleItem.Create(bankKey: GoodBankKey, itemKey: 209, isPerformanceItem: true, associatedStimulus: 1, fieldTestUse: fieldTestUseVar);
        //    PerformanceDigestDuplicate = SampleItem.Create(bankKey: DuplicateBankKey, itemKey: 210, isPerformanceItem: true, associatedStimulus: 1, fieldTestUse: fieldTestUseVar);

        //    BrailleItem = SampleItem.Create(bankKey: GoodBankKey, itemKey: 211, isPerformanceItem: true, associatedStimulus: 1,
        //        fieldTestUse: fieldTestUseVar,
        //        brailleOnlyItem: false,
        //        brailleItemCodes: ImmutableArray.Create("123"),
        //        braillePassageCodes: ImmutableArray.Create("123"));

        //    BrailleItemDuplicate = SampleItem.Create(bankKey: DuplicateBankKey, itemKey: 212, isPerformanceItem: true, associatedStimulus: 1,
        //        fieldTestUse: fieldTestUseVar,
        //        brailleOnlyItem: false,
        //        brailleItemCodes: ImmutableArray.Create("123"),
        //        braillePassageCodes: ImmutableArray.Create("123"));

        //    BrailleItemReplace = SampleItem.Create(bankKey: DuplicateBankKey, itemKey: 213, isPerformanceItem: true, associatedStimulus: 2,
        //        fieldTestUse: fieldTestUseVar,
        //        brailleOnlyItem: true,
        //        brailleItemCodes: ImmutableArray.Create("123"),
        //        braillePassageCodes: ImmutableArray.Create("123"),
        //        copiedFromItem: 211);

        //    SampleItems = ImmutableArray.Create(MathDigest, ElaDigest, DuplicateDigest, DuplicateDigest, DuplicateDigest, PerformanceDigest, PerformanceDigestDuplicate, BrailleItem, BrailleItemDuplicate, BrailleItemReplace);
        //    var itemCards = ImmutableArray.Create(MathCard, ElaCard, DuplicateCard, DuplicateCard, DuplicateCard);

        //    Math = new Subject("Math", "", "", new ImmutableArray<Claim>() { }, new ImmutableArray<string>() { });
        //    Ela = new Subject("ELA", "", "", new ImmutableArray<Claim>() { }, new ImmutableArray<string>() { });
        //    NotASubject = new Subject("NotASubject", "", "", new ImmutableArray<Claim>() { }, new ImmutableArray<string>() { });
        //    Claim1 = new Claim("1", "", "");
        //    Claim2 = new Claim("2", "", "");

        //    //generated item cards for more like this tests
        //    itemCards = itemCards.AddRange(MoreItemCards());
        //    var settings = new AppSettings() { SettingsConfig = new SettingsConfig() { NumMoreLikeThisItems = 3 } };

        //    Context = SampleItemsContext.Create(sampleItems: SampleItems, itemCards: itemCards, appSettings: settings);

        //    var loggerFactory = new Mock<ILoggerFactory>();
        //    var logger = new Mock<ILogger>();
        //    loggerFactory.Setup(lf => lf.CreateLogger(It.IsAny<string>())).Returns(logger.Object);
        //    ItemViewRepo = new ItemViewRepo(Context, loggerFactory.Object);
        //}

    }
}
