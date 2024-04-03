import { Collection } from 'mongodb';
import { format } from 'util';
import { logSchema } from './schemas.js';

/**
 * @param {Collection?} collection
 * The mongo collection.
 * 
 */
export function newLazyMongoLog(collection = undefined) {
    let _collection = collection;

    async function write(
        message,
        optionalParams,
        type,
        use_console = true
    ) {
        const text = format(message, ...optionalParams);

        if (use_console)
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

        if (_collection != null)
            await _collection.insertOne(logSchema({
                type,
                message: text
            }));
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
        await write(message, optionalParams, 'info');
    }

    print.info = print;

    /**
     * Will not write to console.
     * 
     * Type = `info`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.infoNoConsole = async function (
        message = undefined,
        ...optionalParams
    ) {
        await write(message, optionalParams, 'info', false);
    };

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
        await write(message, optionalParams, 'warning');
    };

    /**
     * Will not write to console.
     * 
     * Type = `warning`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.warnNoConsole = async function (
        message = undefined,
        ...optionalParams
    ) {
        await write(message, optionalParams, 'warning', false);
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
        await write(message, optionalParams, 'error');
    };

    /**
     * Will not write to console.
     * 
     * Type = `error`
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.errorNoConsole = async function (
        message = undefined,
        ...optionalParams
    ) {
        await write(message, optionalParams, 'error', false);
    };

    /**
     * Write a log with a custom log type.
     * 
     * @param {string} type
     * The type of log this should be.
     * 
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.custom = async function (
        type,
        message = undefined,
        ...optionalParams
    ) {
        await write(message, optionalParams, type);
    };

    /**
     * Will not write to console.
     * 
     * @param {string} type
     * The type of log this should be.
     * 
     * @param {any} message 
     * @param  {...any} optionalParams 
     */
    print.customNoConsole = async function (
        type,
        message = undefined,
        ...optionalParams
    ) {
        await write(message, optionalParams, type, false);
    };

    /**
     * 
     * @param {Collection} collection 
     */
    print.setCollection = function (collection) {
        _collection = collection;
    };

    return print;
}