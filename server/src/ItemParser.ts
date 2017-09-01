import * as Http from 'http';


export class ItemParser {
    get(url: string) {
        return new Promise<string>((resolve, reject) => {
            let htmlBody: string;
            Http.get(url, res => {
                if (res.statusCode !== 200) {
                    reject('Http status code ' + res.statusCode);
                }
                res.setEncoding('utf8');
                res.on('data', chunk => {
                    htmlBody += chunk;
                });
                res.on('end', () => {
                    resolve(htmlBody);
                });
                res.on('error', err => {
                    reject(err);
                })
            });
        });
    }
}