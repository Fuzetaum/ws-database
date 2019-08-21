# Warning note

This library is still under development. We do **not** recommend using it yet since its features and/or interfaces might change in a nightly basis.

Also, it has not been tested properly yet. Test cases are still being designed as the library evolves, so its stability can't be guaranteed for now.

If you still want to use it, consider checking this library's behavior when debugging your project.

# About

Implementation of a series of Node.js database connection drivers and SDKs, allowing developers to rapidly connect web services to their databases. This library allows you to connect to your database by simply providing its configuration properties. When the system starts, it opens the connection automatically and exports a set of methods that can be used to perform operations against the chosen database.

While you don't have to write a single line of code to handle database connection, you need only to change or add property values to your configuration in order to change from one database type to another, allowing you to switch between different infrastructures in minutes (given you already have databases laid out, of course).

# Setup

This library uses the [ws-core](https://www.npmjs.com/package/@ricardofuzeto/ws-core) "under the hood". This means that all your database's configuration properties will be located in an `application.json` file in your project's root. *ws-database* expects the following properties in your configuration file:

```
{
  // ...some JSON properties

  "database": {
    "type": "your-database-type",
    "configuration": { /* database configuration properties */ }
  },

  // ...some other JSON properties
}
```

The `configuration` field is an object that contains all fields needed to configure your database. Each supported database driver is further explained ahead, along with their needed configuration. The currently supported databases are:

* [Google Firebase](#google-firebase)
* [MongoDB](#mongodb)

# Importing the database connector

As mentioned before, *ws-database* handles the connection part by itself. When importing it in your project, you will actually **import a promise, that returns all manipulation methods when resolved**. This is very important, because you can only guarantee that your application is connected to your database when this promise is resolved. The simplest way of doing so is the following:

```
const wsDatabase = require('@ricardofuzeto/ws-database');
let db;

(async () => {
  db = await wsDatabase;
})();
```

You can either choose to continue booting your application right after waiting for your database connection, or handle the cases when you might need to wait some time before `db` actually has some value. Note that in this approach, `db` is `undefined` until the database connection is established.

# Database operations

## Google Firebase

In order to connect your application to your Google Firebase storage, you will need the following configuration properties:

```
  "apiKey": "firebase-api-key",
  "authDomain": "firebase-auth-domain",
  "databaseURL": "firebase-db-url"
```

Firebase's manipulation methods are: *create, deleteObject, get, set and update*. For all methods, the following definitions apply for their signatures:

| parameter | type | default | explanation |
| :-------: | :--: | :-----: | ----------- |
| data      | object |   -   | JavaScript object that will be saved at `object` location |
| object    | string |   -   | Reference to a node in Firebase's document (you can also think about it as the "path" to access an object's data) |

The available method's signatures are:

### create(object, data)

### deleteObject(object)

### get(object)

### set(object, data)

### update(object, data)

## MongoDB

In order to connect your application to your MongoDB instance, you will need the following configuration properties:

```
  "databaseName": "collection-name",
  "host": "mongodb-location-url",
  "port": "mongodb-location-port"
```

MongoDB's manipulation methods are: *create, deleteObject, get, set and update*. For all methods, the following definitions apply for their signatures:

| parameter | type | default | explanation |
| :-------: | :--: | :-----: | ----------- |
| collection | string |  -   | Collection name of your MongoDB instance's database |
| query     | object |   -   | JavaScript object that will be used as search parameter. MongoDB implementation will look after objects that have all fields in the specified `query`, and with matching values |
| object    | object |   -   | JavaScript object that will be saved in the specified collection. `create` and `set` a new object like `object` will be created, while `update` will merge `object` with the first object found according to `query` fields and values |
| cb        | function | -   | Callback function that is called after each database operation. It receives two arguments: first, an error object if any persisted without being thrown; second, the operation's result

The available method's signatures are:

### create(collection, query, object, cb)

### deleteObject(collection, query, cb)

### get(collection, query, cb)

### set(collection, object, cb)

### update(collection, query, object, cb)