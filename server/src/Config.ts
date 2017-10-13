interface Config {
    sampleItemsApi: string;
    itemViewerServiceApi: string;
    screenshotPageWidth: number;
    port: number;
    catCode: string;
    performanceItemsCode: string;
}

let production = require('../../config/production.json') as Config;
let development = require('../../config/development.json') as Config;

export function getConfig(env?: string) {
    switch(env || process.env.NODE_ENV || 'production') {
        case 'development': 
            return overrideProps(development);
        case 'production':
            return overrideProps(production);
        default: 
            return overrideProps(production);
    }
}

function overrideProps(config: Config) {
    const configObject = config as any;
    Object.keys(configObject).forEach(key => {
        if (process.env[key]) {
            configObject[key] = process.env[key];
        }
    });
    return configObject as Config;
}
