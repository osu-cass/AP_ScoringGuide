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

export class ItemDataManager {
    chrome: ItemCapture;

    constructor() {
        this.chrome = new ItemCapture();
        this.openChromeIfNeeded();
    }

    async openChromeIfNeeded() {
        if (!this.chrome.browser) {
            await this.chrome.launchBrowser();
        }
    }

    /**
     * Takes one item id (or an array of related item ids, in case of performance items)
     */
    async getItemData(ids: string[]): Promise<ItemGroupModel> {
        if (ids.length === 0) {
            return { questions: [] };
        }

        let itemData = await new ItemParser().loadItemData(ids);
        let takePictures = false;

        const sPath = Path.join(__dirname, SCREENSHOT_PATH);
        if (!FileSystem.existsSync(sPath)) {
            FileSystem.mkdirSync(sPath);
        }

        takePictures = this.getPassagePaths(itemData, ids, takePictures);
        takePictures = this.getQuestionPaths(itemData, takePictures);

        if (takePictures) {
            itemData = await this.chrome.takeScreenshots(itemData);
        }

        return itemData;
    }

    private getPassagePaths(
        itemData: ItemGroupModel,
        ids: string[],
        takePictures: boolean
    ): boolean {
        let shouldScreenshot = takePictures;
        if (itemData.passage && itemData.passage.type === PdfViewType.picture) {
            const possiblePassagePaths: ItemPdfModel[] = ids.map(itemId => {
                const picPath = Path.join(
                    __dirname,
                    SCREENSHOT_PATH,
                    `${itemId}-passage.png`
                );

                return {
                    picturePath: picPath,
                    screenshotUrl: URL.resolve(
                        SCREENSHOT_URL,
                        `${itemId}-passage.png`
                    ),
                    id: itemId,
                    type: PdfViewType.picture,
                    captured: FileSystem.existsSync(picPath)
                };
            });

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

    private getQuestionPaths(itemData: ItemGroupModel, takePictures: boolean) {
        let shouldScreenshot = takePictures;
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
