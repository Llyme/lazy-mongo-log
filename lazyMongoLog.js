import { Collection } from 'mongodb';
import { format } from 'util';
import { logSchema } from './schemas.js';

/**
 * @typedef {Object} Configuration
 * 
 * @property {Collection} [collection]
 * The MongoDB collection.
 * 
 * Default value is `null`.
 * 
 * @property {string} [keyword]
 * Optional keyword that will be included in the log.
 * 
 * Default value is `null`.
 * 
 * @property {boolean} [useConsole]
 * If the message should also be printed on the console.
 * 
 * Default value is `true`.
 * 
 * @property {string} [type]
 * The default log type.
 * 
 * Default value is `info`.
 * 
 * @property {(message: string, type: string, keyword: string?) => Promise<object>|object} [customLogCallback]
 * Allows changing how the log document is inserted
 * to the collection.
 * 
 * Default value is `null`.
 */

/**
 * @param {Configuration} config
 */
export function newLazyMongoLog(config = {}) {
    let _config = config;

    async function write(
        message,
        optionalParams,
        type
    ) {
        const {
            collection,
            keyword,
            customLogCallback,
            useConsole = true
        } = _config;

        const text = format(message, ...optionalParams);

        if (useConsole)
            switch (type) {
                case 'warning':
                    console.warn(message, ...optionalParams);
                    break;

                case 'error':
                    console.error(message, ...optionalParams);
                    break;

                case 'info':
                default:
                    console.log(message, ...optionalParams);
                    break;
            };

        if (collection != null)
            try {
                const document =
                    customLogCallback != null
                        ? await customLogCallback(text, type, keyword)
                        : logSchema({
                            type,
                            message: text,
                            keyword
                        });
                const result =
                    await collection.insertOne(document);

                return result.acknowledged;

            } catch (e) {
                return false;
            }

        return true;
    }

    /**
     * Functions the same way as `console.log(...)` or
     * `console.info(...)`.
     * 
     * Type = `info`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    async function print(
        message = undefined,
        ...optionalParams
    ) {
        const {
            type = 'info'
        } = _config;

        return await write(message, optionalParams, type);
    }

    print.info = print;

    /**
     * Functions the same way as `console.warn(...)`.
     * 
     * Type = `warning`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.warn = async function (
        message = undefined,
        ...optionalParams
    ) {
        return await write(message, optionalParams, 'warning');
    };

    /**
     * Functions the same way as `console.error(...)`.
     * 
     * Type = `error`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.error = async function (
        message = undefined,
        ...optionalParams
    ) {
        return await write(message, optionalParams, 'error');
    };

    /**
     * Create a new logger with the given configuration.
     * 
     * Omitted fields will use the current configuration.
     * @param {Configuration} config 
     */
    print.using = function (config = {}) {
        return newLazyMongoLog({
            ..._config,
            ...config
        });
    };

    /**
     * Permanently modify the current configuration.
     * 
     * Omitted fields will use the current configuration.
     * @param {Configuration} config 
     */
    print.set = function (config) {
        _config = config;
    };

    return print;
}
