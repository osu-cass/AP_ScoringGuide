interface Config {
    api: {
        sampleItems: string;
        itemViewerService: string;
    };
    screenshotPageWidth: number;
}

let production = require('../../config/production.json') as Config;
let development = require('../../config/development.json') as Config;

export function getConfig(env?: string) {
    switch(env || process.env.NODE_ENV) {
        case 'development': 
            return development;
        case 'production':
            return production;
    }
}

