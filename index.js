const { context, log } = require('@ricardofuzeto/ws-core');
const { DATABASES } = require('./src/constants');
const database = require('./src/configuration');

const { properties } = context;

const dbProperties = properties.get('database');
if (!dbProperties || Object.keys(dbProperties).length === 1) {
  log.ERROR_FATAL('Error when initializing database: bean with id "database" not found');
  log.ERROR_FATAL('Please, check your ".env" file');
  process.exit(1);
}
if (!dbProperties.type || !DATABASES.includes(dbProperties.type)) {
  log.ERROR_FATAL('Invalid value for property "type" in database configuration');
  log.ERROR_FATAL(`Supported values: ${DATABASES.join(',')}`);
}

module.exports = database[dbProperties.type]();
