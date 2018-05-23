import * as RequestPromise from "./RequestPromise";
import * as Cheerio from "cheerio";
import { ItemGroupModel, PdfViewType } from "@osu-cass/sb-components";
import * as URL from 'url';

const { ITEM_VIEWER_SERVICE_API } = process.env;

// tslint:disable-next-line:no-unnecessary-class
export class ItemParser {
    itemViewGetter: (items: string[]) => Promise<string>;

    constructor(itemViewGetter: (items: string[]) => Promise<string>) {
        this.itemViewGetter = itemViewGetter;
    }

    /**
     * Parse XML string returned from Item Viewer Service
     *
     * @param {string} xmlString
     * @returns item contents as HTML string
     */
    public static parseXml(xmlString: string): string {
        const $ = Cheerio.load(xmlString, {
            xmlMode: true
        });

        return $("html").text();
    }

    public static prepHtmlForPrinting($: CheerioStatic, baseUrl: string): CheerioStatic {
        $("a").remove();
        $(".questionNumber").remove();
        $("img").map((i, el) => {
            el.attribs["src"] = URL.resolve(baseUrl, el.attribs["src"]);
        });

        ItemParser.fixMultipleChoice($);

        return $;
    }

    /**
     * Given item or group of items and HTML string containing their content, parses out question and passage HTML and associates them in an `ItemGroupModel`.
     * Also makes images absolute links to IVS, removes links we don't want to print, and reformats multiple choice options
     *
     * @param {string} htmlString unprocessed string of HTML from IVS
     * @param {string[]} itemIds should be related to each other (have the same passage) and be in the form `BANK-ITEM` (ex: "187-1437").
     * @param {string?} baseUrlOverride override the base url. Otherwise, we'll use the environment variable `ITEM_VIEWER_SERVICE_API`. This is primarily for testing.
     */
    public static parseHtml(
        htmlString: string,
        itemIds: string[],
        baseUrlOverride?: string
    ): ItemGroupModel {
        const baseUrl = baseUrlOverride || ITEM_VIEWER_SERVICE_API;
        let $ = Cheerio.load(htmlString);
        $ = this.prepHtmlForPrinting($, baseUrl);

        const itemData: ItemGroupModel = {
            questions: []
        };

        if ($(".thePassage").length) {
            const takePicture = ItemParser.shouldTakePicture($(".thePassage"));
            itemData.passage = {
                id: itemIds[0],
                type: takePicture ? PdfViewType.picture : PdfViewType.html,
                html: takePicture ? undefined : $(".thePassage").html(),
                captured: !takePicture
            };
        }

        itemIds.forEach(itemId => {
            const selector = `#Item_${itemId.split("-").pop()}`;
            const takePicture = ItemParser.shouldTakePicture($(selector));
            itemData.questions.push({
                id: itemId,
                view: {
                    id: itemId,
                    type: takePicture ? PdfViewType.picture : PdfViewType.html,
                    html: takePicture ? undefined : $(selector).html(),
                    captured: !takePicture
                }
            });
        });

        return itemData;
    }

    /**
     * Do we need to take a screenshot of the question or passage? We will need to if there is an element with the text `"Initializing"`
     * because that signifies there is an interactive component using JavaScript to render the content, meaning it will not display
     * correctly without a screenshot.
     *
     * @param {Cheerio} element cheerio object to query
     */
    private static shouldTakePicture(element: Cheerio): boolean {
        const initializing = element.find("span").filter((i, el) => {
            if (el.children[0]) {
                // tslint:disable-next-line:no-any
                return (el.children[0] as any).data === "Initializing";
            }

            return false;
        }).length;

        return initializing !== 0;
    }

    /**
     * Load a group of associated items (or an array with just 1 item) and parse HTML result.
     * Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437).
     *
     * @param {string[]} items
     */
    public async loadItemData(items: string[]): Promise<ItemGroupModel> {
        const response = await this.itemViewGetter(items);
        const htmlString = await ItemParser.parseXml(response);

        return ItemParser.parseHtml(htmlString, items);
    }

    /**
     * Load a group of associated items (or an array with just 1 item) and parse XML result
     *
     * @param {string} item
     * @returns {Promise<string>} HTML inside XML result from IVS
     */
    public async loadPlainHtml(item: string): Promise<string> {
        const response = await this.itemViewGetter([item]);

        return ItemParser.parseXml(response);
    }

    /**
     * Find all instances of multiple choice and move option tag (A, B, C, etc.) to same line as option content and make the tags bold
     *
     * @param {CheerioStatic} $ Cheerio object to query
     * @returns same Cheerio object with multiple choice made more readable
     */
    public static fixMultipleChoice($: CheerioStatic) {
        $(".optionContainer").each((i, el) => {
            const optionElements = $(el)
                .children(".optionContent")
                .children();
            const optionVal =
                optionElements.length === 1 && optionElements.first().is("p")
                    ? $(el)
                          .children(".optionContent")
                          .children("p")
                          .html()
                    : $(el)
                          .children(".optionContent")
                          .html();
            // tslint:disable-next-line:no-inner-html
            $(el).html(
                `<b> ${$(el)
                    .children("input")
                    .attr("value")}:</b> ${optionVal}`
            );
        });

        return $;
    }
}
