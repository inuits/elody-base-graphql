import { Environment } from '../environment';

const quotePlus = (str: string): string =>
  encodeURIComponent(str).replace(/%20/g, '+');

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
    connectionString += `/?authSource=${mongoConfig.dbName}`;
    if (mongoConfig.replicaSet) {
      connectionString += `&replicaSet=${mongoConfig.replicaSet}`;
    }
  }
  console.log(connectionString);
  return connectionString;
};
