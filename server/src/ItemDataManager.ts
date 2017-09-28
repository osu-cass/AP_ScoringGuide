import { ItemCapture } from "./ItemCapture";
import * as FileSystem from 'fs';
import * as Path from 'path';
import { ItemGroup, Question, ItemView, ViewType } from "./Models";
import { ItemParser } from "./ItemParser";

export interface ScreenshotOptions {
    screenshotPath: string,
    pageWidth: number
}

export class ItemDataManager {
    chrome: ItemCapture;
    screenshotPath: string;

    constructor(options: ScreenshotOptions) {
        this.chrome = new ItemCapture(options.pageWidth);
        this.screenshotPath = options.screenshotPath
        this.openChromeIfNeeded();
    }

    async openChromeIfNeeded() {
        if (!this.chrome.browser) {
            await this.chrome.launchBrowser();
        }
    }

    /** Takes one item id (or an array of related item ids, in case of performance items) */
    async getItemData(ids: string[]) {
        if (ids.length === 0) {
            return {
                questions: []
            } as ItemGroup;
        }

        let itemData = await new ItemParser().loadItemData(ids);
        let takePictures = false;

        if (!FileSystem.existsSync(this.screenshotPath)) {
            FileSystem.mkdirSync(this.screenshotPath); 
        }

        takePictures = this.getPassagePaths(itemData, ids, takePictures);
        takePictures = this.getQuestionPaths(itemData, takePictures);

        if (takePictures) {
            itemData = await this.chrome.takeScreenshots(itemData);
        }
        return itemData
    }

    private getPassagePaths(itemData: ItemGroup, ids: string[], takePictures: boolean) {
        if (itemData.passage && itemData.passage.type === ViewType.picture) {
            const possiblePassagePaths = ids.map(id => {
                const pth = Path.join(this.screenshotPath, id + '-passage.png');
                return {
                    picturePath: pth,
                    id: id,
                    type: ViewType.picture,
                    captured: FileSystem.existsSync(pth)
                } as ItemView;
            });

            const capturedPassages = possiblePassagePaths.filter(pp => pp.captured);
            if (capturedPassages.length > 0) {
                itemData.passage = capturedPassages[0];
            } else {
                itemData.passage = possiblePassagePaths[0];
                takePictures = true;
            }
        }
        return takePictures;
    }

    private getQuestionPaths(itemData: ItemGroup, takePictures: boolean) {
        itemData.questions.forEach(q => {
            if (q.view.type === ViewType.picture) {
                const pth = Path.join(this.screenshotPath, q.id + '-question.png');
                const captured = FileSystem.existsSync(pth);
                if (!captured) {
                    takePictures = true;
                }
                q.view.picturePath = pth;
                q.view.captured = captured;
            }
        });
        return takePictures;
    }
}