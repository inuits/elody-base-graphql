import { Environment } from '../types/environmentTypes';

const quotePlus = (str: string): string =>
  encodeURIComponent(str).replace(/%20/g, '+');

export const isMongoConfigAvailable = (): boolean => {
  return !!(
    process.env.MONGODB_DB_NAME &&
    process.env.MONGODB_HOSTS &&
    process.env.MONGODB_PORT
  );
};

export const createMongoConnectionString = (appConfig: Environment): string => {
  const mongoConfig = appConfig.db.mongodb;
  let connectionString: string = 'mongodb://';
  if (mongoConfig.username && mongoConfig.password) {
    connectionString += `${quotePlus(mongoConfig.username)}:${quotePlus(
      mongoConfig.password
    )}@`;
  }
  const mongoHostsArray: string[] = mongoConfig.hostname.split(',');
  mongoHostsArray.forEach((hostname, index) => {
    if (mongoConfig.port) {
      connectionString += `${hostname}:${mongoConfig.port}`;
    } else {
      connectionString += `${hostname}`;
    }
    if (index < mongoHostsArray.length - 1) {
      connectionString += ',';
    }
  });
  if (mongoConfig.dbName) connectionString += `/${mongoConfig.dbName}`;
  if (mongoConfig.username && mongoConfig.password) {
    if (mongoConfig.authSource) {
      connectionString += `?authSource=${mongoConfig.authSource}`;
    } else {
      connectionString += `?authSource=${mongoConfig.dbName}`;
    }
    if (mongoConfig.tls) {
      connectionString += `&tls=${mongoConfig.tls}`;
    }
    if (mongoConfig.replicaSet) {
      connectionString += `&replicaSet=${mongoConfig.replicaSet}`;
    }
  }
  return connectionString;
};
