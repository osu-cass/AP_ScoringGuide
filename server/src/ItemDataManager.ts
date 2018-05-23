import { ItemCapture } from "./ItemCapture";
import * as FileSystem from "fs";
import * as Path from "path";
import * as URL from "url";
import {
    ItemGroupModel,
    ItemPdfModel,
    PdfViewType
} from "@osu-cass/sb-components";
import { ItemParser } from "./ItemParser";

const { SCREENSHOT_PATH, SCREENSHOT_URL } = process.env;

/**
 *
 *
 * @class ItemDataManager
 */
export class ItemDataManager {
    chrome: ItemCapture;
    itemViewGetter: (items: string[]) => Promise<string>;

    constructor(itemViewGetter: (items: string[]) => Promise<string>) {
        this.chrome = new ItemCapture();
        this.openChromeIfNeeded();
        this.itemViewGetter = itemViewGetter;
    }

    async openChromeIfNeeded() {
        if (!this.chrome.browser) {
            await this.chrome.launchBrowser();
        }
    }

    /**
     * Assembles item view data for given id(s) by calling `ItemParser.loadItemData()` and `ItemCapture.takeScreenshots()`
     *
     * @param {string[]} ids Takes one item id (or an array of related item ids, in case of performance items)
     * @returns {Promise<ItemGroupModel>} `ItemGroupModel` which does not have metadata yet
     */
    async getItemData(ids: string[]): Promise<ItemGroupModel> {
        if (ids.length === 0) {
            return { questions: [] };
        }

        const itemParser = new ItemParser(this.itemViewGetter);
        let itemData = await itemParser.loadItemData(ids);

        const sPath = Path.join(__dirname, SCREENSHOT_PATH);
        if (!FileSystem.existsSync(sPath)) {
            FileSystem.mkdirSync(sPath);
        }

        let takePictures = this.getPassagePaths(itemData);
        takePictures = this.getQuestionPaths(itemData) || takePictures;// This way we don't short circuit

        if (takePictures) {
            itemData = await this.chrome.takeScreenshots(itemData);
        }

        return itemData;
    }

    /**
     * Update `ItemGroupModel` with screenshot path and url for passage. Return true if screenshots need to be
     * taken and false if screenshots already exist
     *
     * @param {ItemGroupModel} itemData
     * @returns {boolean} true if screenshots need to be taken, false if screenshots already exist for passage
     */
    private getPassagePaths(itemData: ItemGroupModel): boolean {
        let shouldScreenshot = false;
        if (itemData.passage && itemData.passage.type === PdfViewType.picture) {
            const possiblePassagePaths: ItemPdfModel[] = itemData.questions.map(
                question => {
                    const picPath = Path.join(
                        __dirname,
                        SCREENSHOT_PATH,
                        `${question.id}-passage.png`
                    );

                    return {
                        picturePath: picPath,
                        screenshotUrl: URL.resolve(
                            SCREENSHOT_URL,
                            `${question.id}-passage.png`
                        ),
                        id: question.id,
                        type: PdfViewType.picture,
                        captured: FileSystem.existsSync(picPath)
                    };
                }
            );

            const capturedPassages = possiblePassagePaths.filter(
                pp => pp.captured
            );
            if (capturedPassages.length > 0) {
                itemData.passage = capturedPassages[0];
            } else {
                itemData.passage = possiblePassagePaths[0];
                shouldScreenshot = true;
            }
        }

        return shouldScreenshot;
    }

    /**
     * Update `ItemGroupModel` with paths and urls for question screenshots. Returns true if screenshots need
     * to be taken for one or more of the questions, false otherwise.
     *
     * @param {ItemGroupModel} itemData
     */
    private getQuestionPaths(itemData: ItemGroupModel): boolean {
        let shouldScreenshot = false;
        itemData.questions.forEach(q => {
            if (q.view.type === PdfViewType.picture) {
                const pth = Path.join(
                    __dirname,
                    SCREENSHOT_PATH,
                    `${q.id}-question.png`
                );
                const captured = FileSystem.existsSync(pth);
                if (!captured) {
                    shouldScreenshot = true;
                }
                q.view.picturePath = pth;
                q.view.screenshotUrl = URL.resolve(
                    SCREENSHOT_URL,
                    `${q.id}-question.png`
                );
                q.view.captured = captured;
            }
        });

        return shouldScreenshot;
    }
}
