import { ItemCapture, ScreenshotOptions } from "./item-capture";
import * as FileSystem from 'fs';
import * as Path from 'path';
import { PicturePath, PictureType, ItemPictures } from "./models";

export class ScreenshotManager {
    chrome: ItemCapture;

    constructor(options: ScreenshotOptions) {
        this.chrome = new ItemCapture(options);
    }

    async openChromeIfNeeded() {
        if (!this.chrome.browser) {
            await this.chrome.launchBrowser();
        }
    }

    /** Takes one item id (or an array of related item ids, in case of performance items) */
    async getScreenshots(ids: string[]) {
        if (ids.length === 0) {
            return {
                questions: []
            } as ItemPictures;
        }

        await this.openChromeIfNeeded();
        const questionPaths = ids.map(id => {
            const pth = Path.join(this.chrome.screenshotPath, id + '-question.png')
            return {
                path: pth,
                item: id,
                type: PictureType.question,
                captured: FileSystem.existsSync(pth)
            } as PicturePath;
        });
        const possiblePassagePaths = ids.map(id => {
            const pth = Path.join(this.chrome.screenshotPath, id + '-passage.png')
            return {
                path: pth,
                item: id,
                type: PictureType.question,
                captured: FileSystem.existsSync(pth)
            } as PicturePath;
        });

        const uncapturedQuestions = questionPaths.filter(qp => !qp.captured);
        let idList = uncapturedQuestions.map(uq => uq.item);

        const passageCaptured = possiblePassagePaths.filter(pp => pp.captured).length > 0
        if (idList.length === 0 && !passageCaptured) {
            idList.push(possiblePassagePaths[0].item);
        }

        if (idList.length > 0) {
            return await this.chrome.takeScreenshots(idList);
        } else {
            return {
                questions: []
            } as ItemPictures;
        }
    }
}