import * as Request from 'request';

export function get(url: string) {
    return new Promise<string>((resolve, reject) => {
        Request.get(url, {
            headers: {
                "Accept": "",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
}

export function post(url: string, body: any) {
    return new Promise<string>((resolve, reject) => {
        Request.post(url, {
            json: body,
            headers: {
                "Accept": "",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
}