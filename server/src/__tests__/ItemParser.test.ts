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
    it("", () => {
        const $ = Cheerio.load(
            `<div class='optionContainer'><div class='optionContent'><div></div></div></div>`
        );
        const htmlWithoutLink = "<p>test</p>";

        const result = ItemParser.prepHtmlForPrinting($, "");
        expect(result("a").length).toEqual(0);
    });
});