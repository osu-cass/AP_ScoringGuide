import * as Path from "path";
import * as FileStructure from "fs";
import {
    ItemGroupModel,
    ItemPdfModel,
    PdfViewType
} from "@osu-cass/sb-components";
import * as Puppeteer from "puppeteer";

const { SCREENSHOT_WIDTH, ITEM_VIEWER_SERVICE_API } = process.env;

export interface ContentDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface QuestionDimensions extends ContentDimensions {
    itemId: string;
}

export class ItemCapture {
    browser: Puppeteer.Browser;

    async launchBrowser() {
        this.browser = await Puppeteer.launch({ args: ["--no-sandbox"] });
        console.log("chrome url: ", this.browser.wsEndpoint());
    }

    getIdString(paths: ItemGroupModel): string {
        const ids: string[] = [];
        paths.questions.forEach(p => {
            if (p.view.type === PdfViewType.picture) {
                ids.push(p.id);
            }
        });

        if (ids.length === 0 && paths.passage) {
            ids.push(paths.passage.id);
        }

        return ids.join(",");
    }

    /**
     * Updates the viewport's size to be the size of the contents
     * (header height + item view height) when the width is as specified
     *
     * @param page Puppeteer page object
     * @param iframe puppeteer iframe object containing the item view
     * @param pageWidth desired page width
     */
    public static async updateViewportSize(
        page: Puppeteer.Page,
        iframe: Puppeteer.Frame,
        pageWidth: number
    ) {
        await page.setViewport({
            width: pageWidth,
            height: 1000
        });

        await iframe.waitForSelector(".grouping", {
            timeout: 5000
        });

        await new Promise(resolve => setTimeout(resolve, 200));

        const headerHeight: number = await iframe.evaluate(() => {
            return document.querySelector("#topBar").scrollHeight;
        });
        const groupingHeight: number = await iframe.evaluate(() => {
            return document.querySelector(".grouping").clientHeight;
        });

        await page.setViewport({
            width: pageWidth,
            height: groupingHeight + headerHeight
        });
    }

    public static async getPassageRect(iframe: Puppeteer.Frame): Promise<ContentDimensions> {
        return iframe.evaluate(() => {
            const passage = document.querySelector(".thePassage");
            const rect = passage.getBoundingClientRect();

            return {
                x: scrollX + rect.left,
                y: scrollY + rect.top,
                width: rect.width,
                height: rect.height
            };
        });
    }

    public static async getQuestionRects(
        iframe: Puppeteer.Frame
    ): Promise<QuestionDimensions[]> {
        return iframe.evaluate(() => {
            const headerHeight = document.querySelector(".questionNumber")
                .clientHeight;
            const elements = document.querySelector(".theQuestions").children;
            const rects: QuestionDimensions[] = [];
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < elements.length; i++) {
                const boundingClientRect = elements[i].getBoundingClientRect();
                const rect = {
                    x: scrollX + boundingClientRect.left,
                    y: scrollY + boundingClientRect.top + headerHeight,
                    width: boundingClientRect.width,
                    height: boundingClientRect.height - headerHeight,
                    itemId: elements[i].id.match(/\d+/)[0]
                };
                rects.push(rect);
            }

            return rects;
        });
    }

    async takeScreenshots(itemData: ItemGroupModel): Promise<ItemGroupModel> {
        const page = await this.browser.newPage();
        const idsString = this.getIdString(itemData);
        await page.goto(
            `${ITEM_VIEWER_SERVICE_API}/items?ids=${idsString}&isaap=TDS_SLM1`
        );
        const iframe = await page.frames()[1];

        await ItemCapture.updateViewportSize(page, iframe, Number(SCREENSHOT_WIDTH));

        // passage
        if (
            itemData.passage &&
            itemData.passage.type === PdfViewType.picture &&
            !itemData.passage.captured
        ) {
            const passageRect = await ItemCapture.getPassageRect(iframe);

            await page.screenshot({
                path: itemData.passage.picturePath,
                clip: passageRect
            });
            itemData.passage.captured = true;
        }

        // questions
        const itemRects = await ItemCapture.getQuestionRects(iframe);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < itemRects.length; i++) {
            const question = itemData.questions.find(q =>
                q.id.includes(itemRects[i].itemId)
            );
            if (
                !question.view.captured &&
                question.view.type === PdfViewType.picture
            ) {
                await page.screenshot({
                    path: question.view.picturePath,
                    clip: itemRects[i]
                });
                question.view.captured = true;
            }
        }
        page.close(); // fire and forget

        return itemData;
    }
}
