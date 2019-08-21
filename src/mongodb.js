const { log } = require('@ricardofuzeto/ws-core');
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;

const { properties } = require('@ricardofuzeto/ws-core').context;
const { configuration } = properties.get('database');

let db;
let connected = false;

const mongoConnect = () => {
  const { databaseName, host, port } = configuration;
  log.LOG(`Attempting to connect to MongoDB ${host}:${port}@${databaseName}`);
  const client = new MongoClient(new Server(host, port), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((connectError, mongoClient) => {
    if (connectError) {
      log.WARNING('Could not establish connection with MongoDB');
      log.WARNING('Trying again in 5 seconds');
      setTimeout(mongoConnect, 5000);
    } else {
      db = mongoClient.db(databaseName);
      log.LOG('Connection with MongoDB successful');
      connected = true;
    }
  });
};

const connect = () => new Promise((resolve) => {
  const checkConnection = () => {
    if (!connected) {
      setTimeout(checkConnection, 100);
    } else {
      resolve();
    }
  };

  mongoConnect();
  setTimeout(checkConnection, 100);
});

const create = (collection, query, object, cb) => {
  db.collection(collection).findOne(query, (error, result) => {
    if (error) {
      log.ERROR(`Error when creating new object: ${error}`);
      throw error;
    }
    if (!result) {
      db.collection(collection).insertOne(object, (createError, result) => {
        if (createError) {
          log.ERROR(`Error when creating new object in collection: ${error}`);
          throw createError;
        } else {
          log.LOG(`Collection "${collection}" new object ${JSON.stringify(object)} created successfully`);
          cb(createError, result);
        }
      });
    } else {
      log.WARNING(`Tried to create object ${JSON.stringify(object)} into collection "${collection}", but entity already exists`);
      log.WARNING(`Skipped object creation`);
      cb(error, result);
    }
  });
};

const deleteObject = (collection, query, cb) => {
  db.collection(collection).deleteOne(query, (error, result) => {
    if (error) {
      log.ERROR(`Error when deleting collection "${collection}" object ${JSON.stringify(query)}`);
      log.ERROR(error);
      throw error;
    }
    log.LOG(`Object deleted: collection "${collection}", object ${JSON.stringify(query)}`);
    cb(error, result);
  });
};

const get = (collection, query, cb) => {
  db.collection(collection).findOne(query, (error, result) => {
    if (error) {
      log.ERROR(`Error when searching collection "${collection}": ${error}`);
      throw error;
    }
    cb(error, result);
  });
};

const set = (collection, object, cb) => {
  db.collection(collection).insertOne(object, (createError, result) => {
    if (createError) {
      log.ERROR(`Error when setting object ${JSON.stringify(object)} in collection "${collection}"`);
      log.ERROR(error);
      throw createError;
    } else {
      log.LOG(`Collection "${collection}" object setted successfully`);
      cb(createError, result);
    }
  });
};

const update = (collection, query, object, cb) => {
  db.collection(collection).updateOne(query, { $set: object }, (error, result) => {
    if (error) {
      log.ERROR(`Error when updating collection "${collection}" object ${JSON.stringify(query)}`);
      log.ERROR(error);
      throw error;
    }
    log.LOG(`Object updated: collection "${collection}", object ${JSON.stringify(query)}`);
    cb(error, result);
  });
};

const mongodb = async () => {
  if (!configuration) {
    log.ERROR_FATAL('Could not initialize MongoDB connection: property "configuration" does not exist');
    log.ERROR_FATAL('Please, check your "database" properties in "application.json" file');
    process.exit(1);
  }

  await connect();
  return {
    create,
    deleteObject,
    get,
    set,
    update,
  };
};

module.exports = {
  mongodb,
};
