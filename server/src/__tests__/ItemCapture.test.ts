import * as Mocks from "./Mocks";
import { ItemCapture } from "../ItemCapture";
import { PdfViewType } from "@osu-cass/sb-components";

describe("ItemCapture.getIdString", () => {
    it("gets single id", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString(Mocks.itemGroupModel4569);
        expect(result).toEqual("123-4569");
    });

    it("no image ids", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString(Mocks.itemGroupModel4567);
        expect(result).toEqual("");
    });

    it("passage only", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString({
            passage: {
                id: "182-1234",
                captured: false,
                type: PdfViewType.picture
            },
            questions: []
        });
        expect(result).toEqual("182-1234");
    });

    it("passage only html", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString({
            passage: {
                id: "182-1234",
                captured: false,
                type: PdfViewType.html
            },
            questions: []
        });
        expect(result).toEqual("");
    });
});
