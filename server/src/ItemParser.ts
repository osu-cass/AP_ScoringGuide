import * as RequestPromise from './RequestPromise';
import * as Cheerio from 'cheerio';
import { ItemGroup, ViewType } from "./Models";

const {ITEM_VIEWER_SERVICE_API} = process.env;

export class ItemParser {

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    load(items: string[]) {
        let postData = {
            items: items.map(i => {
                return { response: '', id: 'I-' + i }
            }),
            accommodations: [] as any[]
        }
        return RequestPromise.post(ITEM_VIEWER_SERVICE_API + '/Pages/API/content/load', postData);
    }

    parseXml(xmlString: string) {
        const $ = Cheerio.load(xmlString, {
            xmlMode: true
        });
        const text = $('html').text();
        return text;
    }

    parseHtml(htmlString: string, itemIds: string[]) {
        let baseUrl = ITEM_VIEWER_SERVICE_API;
        let $ = Cheerio.load(htmlString);
        $('a').remove();
        $('.questionNumber').remove();
        $('img').map((i, el) => {
            el.attribs['src'] = baseUrl + el.attribs['src'];
        });

        $ = this.fixMultipleChoice($);

        let itemData: ItemGroup = {
            questions: []
        };

        if ($('.thePassage').length) {
            const takePicture = this.shouldTakePicture($('.thePassage'))
            itemData.passage = {
                id: itemIds[0],
                type: takePicture ? ViewType.picture : ViewType.html,
                html: takePicture ? undefined : $('.thePassage').html(),
                captured: takePicture ? false : true
            }
        }

        itemIds.map(id => {
            const selector = '#Item_' + id.split('-').pop();
            const takePicture = this.shouldTakePicture($(selector));
            itemData.questions.push({
                id: id,
                view: {
                    id: id,
                    type: takePicture ? ViewType.picture : ViewType.html,
                    html: takePicture ? undefined : $(selector).html(),
                    captured: takePicture ? false : true
                }
            });
        });

        return itemData;
    }

    shouldTakePicture(element: Cheerio) {
        let initializing = element.find('span').filter((i, el) => {
            if (el.children[0]) {
                return (el.children[0] as any).data === 'Initializing';
            }
            return false;
        }).length;
        return initializing !== 0;
    }

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    async loadItemData(items: string[]) {
        const response = await this.load(items);
        const htmlString = await this.parseXml(response);
        return this.parseHtml(htmlString, items);
    }

    async loadPlainHtml(item: string) {
        const response = await this.load([item]);
        const baseUrl = ITEM_VIEWER_SERVICE_API;
        const htmlString = await this.parseXml(response);
        return htmlString;
    }

    fixMultipleChoice($: CheerioStatic) {
        $('.optionContainer').each((i, el) => {
            const optionElements = $(el).children('.optionContent').children();
            const optionVal = optionElements.length === 1 && optionElements.first().is('p')
                ? $(el).children('.optionContent').children('p').html()
                : $(el).children('.optionContent').html();
            $(el).html('<b>' + $(el).children('input').attr('value') + ':</b> ' + optionVal);
        });
        return $;
    }
}
