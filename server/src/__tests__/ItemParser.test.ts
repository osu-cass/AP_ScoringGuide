import * as Mocks from "./Mocks";
import { ItemParser } from "../ItemParser";
import * as Cheerio from "cheerio";

describe("ItemParser.parseXml", () => {
    it("parses string out of xml", () => {
        const html = "<p id='test'>test</p>";
        const xml = Mocks.wrapItemHtml(html);

        const result = ItemParser.parseXml(xml).trim();
        expect(result).toEqual(html);
    });
});

describe("ItemParser.prepHtmlForPrinting", () => {
    it("removes links", () => {
        const $ = Cheerio.load(
            "<p>test<p><a href='https://google.com'>google</a>"
        );
        const htmlWithoutLink = "<p>test</p>";

        const result = ItemParser.prepHtmlForPrinting($, "");
        expect(result("a").length).toEqual(0);
    });

    it("removes question number", () => {
        const $ = Cheerio.load(
            "<div><h1 class='questionNumber'>123-4567</h1>5+5=?</div>"
        );

        const result = ItemParser.prepHtmlForPrinting($, "");
        expect(result(".questionNumber").length).toEqual(0);
    });

    it("makes image links full", () => {
        const $ = Cheerio.load("<div><img src='test.png' /></div>");

        const result = ItemParser.prepHtmlForPrinting($, "http://base.url/");
        expect(result("img").attr("src")).toEqual("http://base.url/test.png");
    });
});

describe("ItemParser.fixMultipleChoice", () => {
    it("works with <p> tag", () => {
        const $ = Cheerio.load(Mocks.multipleChoicePTag);

        const result = ItemParser.fixMultipleChoice($);
        const htmlString = result(".optionContainer").html();
        expect(result(".optionContainer").html()).toEqual(
            "<b> A:</b> option 1"
        );
        expect(htmlString).toEqual(expect.stringContaining("option 1"));
        expect(htmlString).toEqual(expect.stringContaining("<b> A:</b>"));
    });

    it("works without <p> tag", () => {
        const $ = Cheerio.load(Mocks.multipleChoiceHtml);

        const result = ItemParser.fixMultipleChoice($);
        const htmlString = result(".optionContainer").html();
        expect(htmlString).toEqual(
            expect.stringContaining("<div>option 2</div><b>bold text</b>")
        );
        expect(htmlString).toEqual(expect.stringContaining("<b> B:</b>"));
    });

    it("works for multiple options", () => {
        const $ = Cheerio.load(
            Mocks.multipleChoiceHtml + Mocks.multipleChoicePTag
        );

        const result = ItemParser.fixMultipleChoice($);
        const firstResult = result(".optionContainer")
            .first()
            .html();
        const secondResult = result(".optionContainer")
            .last()
            .html();
        expect(firstResult).toEqual(
            expect.stringContaining("<div>option 2</div><b>bold text</b>")
        );
        expect(secondResult).toEqual(expect.stringContaining("option 1"));
    });
});

describe("ItemParser.shouldTakePicture", () => {
    it("positive expected result", () => {
        const $ = Cheerio.load(
            "<div class='thePassage'><div><span>Initializing</span></div></div>"
        );

        const result = ItemParser.shouldTakePicture($(".thePassage"));
        expect(result).toBeTruthy();
    });

    it("negative expected result", () => {
        const $ = Cheerio.load(
            "<div class='thePassage'><div><span>What is 4+2?</span></div></div>"
        );

        const result = ItemParser.shouldTakePicture($(".thePassage"));
        expect(result).toBeFalsy();
    });
});
