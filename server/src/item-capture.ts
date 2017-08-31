import * as Path from 'path';
import * as FileStructure from 'fs';
import { PicturePath, ItemPictures, PictureType } from './models';
const puppeteer = require('puppeteer');

export class ItemCapture {
    browser: any;
    pageWidth = 640;

    constructor(pageWidth: number) {
        this.pageWidth = pageWidth;
    }

    async launchBrowser(){
        this.browser = await puppeteer.launch();
        console.log('chrome url: ', this.browser.wsEndpoint());
    }

    getIdString(paths: ItemPictures) {
        let ids = paths.questions.map(p => p.item);
        if (paths.passage) {
            ids.push(paths.passage.item);
        }
        return ids.join(',');
    }

    async takeScreenshots(paths: ItemPictures) {
        const page = await this.browser.newPage();
        const idsString = this.getIdString(paths);
        await page.goto('http://ivs.smarterbalanced.org/items?ids=' + idsString + '&isaap=TDS_SLM1');
        await page.setViewport({
            width: this.pageWidth,
            height: 1000
        });
        const iframe = await page.frames()[1];
        await iframe.waitForSelector('.grouping', {
            timeout: 5000
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        
        const headerHeight: number = await iframe.evaluate(() => {
            return document.querySelector('#topBar').scrollHeight;
        });
        const groupingHeight: number = await iframe.evaluate(() => {
            return document.querySelector('.grouping').clientHeight;
        });

        await page.setViewport({
            width: this.pageWidth,
            height: groupingHeight + headerHeight
        });
    
        // passage
        const passageRect = await iframe.evaluate(() => {
            let passage = document.querySelector('.thePassage');
            if (!passage) {
                return undefined;
            }
            let rect = passage.getBoundingClientRect();
            return {
                x: scrollX + rect.left, 
                y: scrollY + rect.top,
                width: rect.width,
                height: rect.height
            }
        });
        
        if (passageRect && paths.passage) {
            await page.screenshot({
                path: paths.passage.path,
                clip: passageRect
            });
            paths.passage.captured = true
        } else if (!passageRect) {
            paths.passage = undefined;
        }
        
        // questions
        const itemRects = await iframe.evaluate(() => {
            const elements = document.querySelector('.theQuestions').children;
            let rects = [];
            for (let i = 0; i < elements.length; i++) {
                const boundingClientRect = elements[i].getBoundingClientRect();
                var rect = {
                    x: scrollX + boundingClientRect.left,
                    y: scrollY + boundingClientRect.top,
                    width: boundingClientRect.width,
                    height: boundingClientRect.height,
                    itemId: elements[i].id.match(/\d+/)[0]
                };
                rects.push(rect);
            }
            return rects;
        });
    
        for (let i = 0; i < itemRects.length; i++) {
            const question = paths.questions.find(q => q.item.includes(itemRects[i].itemId));
            await page.screenshot({
                path: question.path,
                clip: itemRects[i]
            });
            question.captured = true;
        }
        page.close(); // fire and forget
        return paths;
    }
}
