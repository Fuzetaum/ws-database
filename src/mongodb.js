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

const create = (document, object, cb) => {};

const deleteObject = (document, object, cb) => {};

const get = (document, cb) => {
  db.collection(document).find({}).toArray((err, result) => {
    cb(err, result);
  });
};

const set = (document, object, cb) => {};

const update = (document, object, cb) => {};

const mongodb = async () => {
  const { properties } = require('@ricardofuzeto/ws-core').context;
  const { configuration } = properties.get('database');

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
