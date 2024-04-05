# Lazy Mongo Log
Write to MongoDB as you print!

# Installation
```sh
npm i lazy-mongo-log
```

# How to Use
```js
import { MongoClient } from 'mongodb';
import { newLazyMongoLog } from 'lazy-mongo-log';

const mongo = new MongoClient('mongodb://localhost:27017/');
const database = mongo.db('my-database');
const collection = database.collection('my-collection');

const print = newLazyMongoLog({
    collection
});

print('Hello World!'); // Hello World!
```

### MongoDB

```json
{
    "type": "info",
    "keyword": null,
    "message": "Hello World!",
    "date_created": 2023-01-07T06:42:01.003+00:00
}
```

# Configuration
```js
import { MongoClient } from 'mongodb';
import { newLazyMongoLog } from 'lazy-mongo-log';

const mongo = new MongoClient('mongodb://localhost:27017/');
const database = mongo.db('my-database');
const collection = database.collection('my-collection');

const print = newLazyMongoLog({
    // The MongoDB collection.
    collection: collection,

    // The default type when using the `print(...)`.
    // Other stuff like `print.error(...)` are not affected.
    type: 'super cool info',

    // Keyword to be included in the log.
    keyword: 'my cool keyword',

    // If this should also print on the console.
    useConsole: true,

    // Don't like the log document schema?
    // You can change it here!
    customLogCallback(message, type, keyword) {
        return {
            super_message: message,
            secret_type: type,
            // I don't want your damn keywords!
            hello: 'world!'
        };
    }
});
```

# Other Fun Stuff

### Changing Configurations
If you want to set the configurations later, you can do it like so:
```js
import { MongoClient } from 'mongodb';
import { newLazyMongoLog } from 'lazy-mongo-log';

const print = newLazyMongoLog({
    // We can set the collection later.
    keyword: 'unicorns'
});

print('Hello World!'); // Won't write to MongoDB...

const mongo = new MongoClient('mongodb://localhost:27017/');

const database = mongo.db('my-collection');
const collection = database.collection('my-collection');

print.set({
    collection,
    keyword: 'dragons' // I want dragons instead.
});

print('Hello World!'); // Now it does!
```

### Branching Configurations
Do you only want to change the configuration for one specific thing?
Here is how you do it:
```js
import { MongoClient } from 'mongodb';
import { newLazyMongoLog } from 'lazy-mongo-log';

const print = newLazyMongoLog({
    // We can set the collection later.
    keyword: 'unicorns'
});

print.using({
    keyword: 'dragons'
})('This is a dragon'); // keyword = 'dragons'

print('This is a unicorn.'); // keyword = 'unicorns'

print.using({
    type: 'my lair'
})('Welcome!'); // type = 'my lair'

print('Welcome back!'); // type = 'info'

// You can also do this!
print.using({
    keyword: 'snakes',
    type: 'sneaky'
}).using({
    keyword: 'bears'
}).using({
    collection: mySuperCoolCollection,
    keyword: 'why are you doing this?!'
}).warn('Because, why not?');
```

### Others
More tools to play with:
```js
// Print using `info` type.
print.info('Hello %s!', 'World'); // MongoDB: type = 'info'

// Print using `warning` type. Uses `console.warn(...)`.
print.warn('Tread lightly...'); // MongoDB: type = 'warning'

// Print using `error` type. Uses `console.error(...)`.
print.error('Something bad happened!'); // MongoDB: type = 'error'

// You can wait for it to finish.
const ok = await print.info('It takes time to insert a document.');

console.log(ok); // `true` if successful, otherwise `false`.
```