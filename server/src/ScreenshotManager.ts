import { ItemCapture } from "./ItemCapture";
import * as FileSystem from 'fs';
import * as Path from 'path';
import { PicturePath, PictureType, ItemPictures } from "./models";

export interface ScreenshotOptions {
    screenshotPath: string,
    pageWidth: number
}

export class ScreenshotManager {
    chrome: ItemCapture;
    screenshotPath: string;

    constructor(options: ScreenshotOptions) {
        this.chrome = new ItemCapture(options.pageWidth);
        this.screenshotPath = options.screenshotPath
    }

    async openChromeIfNeeded() {
        if (!this.chrome.browser) {
            await this.chrome.launchBrowser();
        }
    }

    /** Takes one item id (or an array of related item ids, in case of performance items) */
    async getScreenshots(ids: string[]) {
        let itemPictures: ItemPictures = {
            questions: []
        };
        if (ids.length === 0) {
            return itemPictures;
        }

        await this.openChromeIfNeeded();
        if (!FileSystem.existsSync(this.screenshotPath)) {
            FileSystem.mkdirSync(this.screenshotPath); 
        }

        itemPictures.questions = ids.map(id => {
            const pth = Path.join(this.screenshotPath, id + '-question.png')
            return {
                path: pth,
                item: id,
                type: PictureType.question,
                captured: FileSystem.existsSync(pth)
            } as PicturePath;
        });

        const possiblePassagePaths = ids.map(id => {
            const pth = Path.join(this.screenshotPath, id + '-passage.png')
            return {
                path: pth,
                item: id,
                type: PictureType.question,
                captured: FileSystem.existsSync(pth)
            } as PicturePath;
        });

        const capturedPassages = possiblePassagePaths.filter(pp => pp.captured);
        if (capturedPassages.length > 0) {
            itemPictures.passage = capturedPassages[0];
        } else {
            itemPictures.passage = possiblePassagePaths[0];
        }

        return this.chrome.takeScreenshots(itemPictures);
    }
}