const { log } = require('@ricardofuzeto/ws-core');
const firebaseApp = require('firebase/app');
require('firebase/database');

const get = async (object) =>
  (await firebaseApp.database().ref(object).once('value')).val();

// Creates new object into database (overwrite-safe)
const create = async (object, data) => {};

// Creates new object into database (not overwrite-safe)
const set = async (object, data) => {
  firebaseApp.database().ref(object).set(data)
    .catch((error) => {
      log.ERROR(`Error when writing data into Firebase document location ${object}:`);
      console.error(error);
    });
};

// Merges old data with provided
const update = async (object, data) => {};

const firebase = () => {
  const { properties } = require('@ricardofuzeto/ws-core').context;
  const { configuration } = properties.get('database');

  if (!configuration) {
    log.ERROR_FATAL('Could not initialize Firebase connection: property "configuration" does not exist');
    log.ERROR_FATAL('Please, check your "database" properties in ".env" file');
    process.exit(1);
  }

  firebaseApp.initializeApp({
    apiKey: configuration.apiKey,
    authDomain: configuration.authDomain,
    databaseURL: configuration.databaseURL,
  });

  return {
    create,
    get,
    set,
    update,
  };
};

module.exports = {
  firebase,
};