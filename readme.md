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

const print = newLazyMongoLog(collection);

print('Hello World!'); // Hello World!
```

### MongoDB

```json
{
    "type": "info",
    "message": "Hello World!",
    "date_created": 2023-01-07T06:42:01.003+00:00
}
```

### Change MongoDB Collection
```js
import { MongoClient } from 'mongodb';
import { newLazyMongoLog } from 'lazy-mongo-log';

const print = newLazyMongoLog(); // We can set the collection later.

print('Hello World!'); // Won't write to MongoDB...

const mongo = new MongoClient('mongodb://localhost:27017/');

const database = mongo.db('my-collection');
const collection = database.collection('my-collection');

print.setCollection(collection);

print('Hello World!'); // Now it does!
```

### More Fun Stuff
```js
// Same as `print(...)`.
print.info('Hello %s!', 'World'); // Hello World!

// Uses `console.warn(...)`.
print.warn('Tread lightly...'); // MongoDB: type = 'warning'

// Uses `console.error(...)`, which is also `console.warn(...)`.
print.error('Something bad happened!'); // MongoDB: type = 'error'

// Uses `console.log(...)`.
print.custom('my lair', 'Welcome!'); // MongoDB: type = 'my lair'

print.infoNoConsole('The console can\'t hear us!'); // Console: ...

// You can wait for it to finish.
const ok = await print.info('It takes time to insert a document.');

console.log(ok); // `true` if successful, otherwise `false`.
```