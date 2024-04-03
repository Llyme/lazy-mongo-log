import { schema } from 'lazy-schema';
import LOG_JSON from './log.json' assert { type: 'json' };

export const logSchema = schema(LOG_JSON, {
    date_created: _ => new Date(),
});