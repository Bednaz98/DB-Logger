const getVersion = () => {
    try {
        const pJSON = require('../package.json');
        return pJSON?.version ?? "N/A"

    } catch (error) {
        return "N/A"
    }
}

const apiEnvironment = process.env?.["DB_LOGGER_ENVIORMENT"] ?? "DEV*";


export const defaultAPI_Tags = [`API_LOGGER_ENV: ${apiEnvironment}`, `API_LOGGER_VERSION: ${getVersion()}`];