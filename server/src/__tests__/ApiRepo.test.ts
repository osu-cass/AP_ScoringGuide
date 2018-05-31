import * as Mocks from "./Mocks";
import { ApiRepo } from "../ApiRepo";
import { ItemGroupModel } from "@osu-cass/sb-components";

const repo = new ApiRepo(
    Mocks.sgVMGetter,
    Mocks.isfmGetter,
    Mocks.aboutItemsGetter,
    Mocks.itemViewGetter
);

describe("ApiRepo.getAssociatedItems", () => {
    it("returns associated items", async () => {
        const result = await repo.getAssociatedItems(["123-4567", "123-4569"]);

        expect(result).toEqual([["123-4567", "123-4568"], ["123-4569"]]);
    });
});

describe("ApiRepo.addDataToViews", () => {
    it("adds question numbers", async () => {
        const item1 = Mocks.clone(Mocks.itemGroupModel4567);
        const item2 = Mocks.clone(Mocks.itemGroupModel4569);
        await repo.addDataToViews([item1, item2]);

        expect(item1.questions[0].questionNumber).toEqual(1);
        expect(item1.questions[1].questionNumber).toEqual(2);
        expect(item2.questions[0].questionNumber).toEqual(3);
    });

    it("adds item metadata", async () => {
        const item1 = Mocks.clone(Mocks.itemGroupModel4569);
        await repo.addDataToViews([item1]);

        expect(item1.questions[0].data).toEqual(Mocks.aboutItemVM3);
    });

    it("adds item metadata for multiple items", async () => {
        const item1 = Mocks.clone(Mocks.itemGroupModel4567);
        await repo.addDataToViews([item1]);

        expect(item1.questions[0].data).toEqual(Mocks.aboutItemVM);
        expect(item1.questions[1].data).toEqual(Mocks.aboutItemVM2);
    });
});

describe("ApiRepo.getAboutItem", () => {
    it("returns the correct item", async () => {
        const result = await repo.getAboutItem(4567, 123);
        expect(result).toEqual(Mocks.aboutItemVM);
    });
});
