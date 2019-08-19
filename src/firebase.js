const { log } = require('@ricardofuzeto/ws-core');
const firebaseApp = require('firebase/app');
require('firebase/database');

const get = async (object) =>
  (await firebaseApp.database().ref(object).once('value')).val();

const create = (object, data) => {
  get(object).then(previous => {
    if (!previous) {
      firebaseApp.database().ref(object).set(data)
        .catch((error) => {
          log.ERROR(`Error when writing data into Firebase document location ${object}:`);
          log.ERROR(error);
        });
    }
  });
};

const deleteObject = (object) => set(object, null);

const set = (object, data) => {
  firebaseApp.database().ref(object).set(data)
    .catch((error) => {
      log.ERROR(`Error when writing data into Firebase document location ${object}:`);
      log.ERROR(error);
    });
};

const update = (object, data) => firebaseApp.database().ref(object).update(data);

const firebase = async () => {
  const { properties } = require('@ricardofuzeto/ws-core').context;
  const { configuration } = properties.get('database');

  if (!configuration) {
    log.ERROR_FATAL('Could not initialize Firebase connection: property "configuration" does not exist');
    log.ERROR_FATAL('Please, check your "database" properties in "application.json" file');
    process.exit(1);
  }

  firebaseApp.initializeApp({
    apiKey: configuration.apiKey,
    authDomain: configuration.authDomain,
    databaseURL: configuration.databaseURL,
  });

  return {
    create,
    deleteObject,
    get,
    set,
    update,
  };
};

module.exports = {
  firebase,
};