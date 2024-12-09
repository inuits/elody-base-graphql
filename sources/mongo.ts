import { Environment } from '../environment';

export const createMongoConnectionString = (appConfig: Environment): string => {
  const mongoConfig = appConfig.db.mongodb;
  let connectionString: string = 'mongodb://';
  if (mongoConfig.username && mongoConfig.password) {
    connectionString += `${mongoConfig.username}:${mongoConfig.password}`;
  }
  const mongoHostsArray: string[] = mongoConfig.hostname.split(',');
  mongoHostsArray.forEach((hostname) => {
    if (mongoConfig.port) {
      connectionString += `${hostname}:${mongoConfig.port}`;
    } else {
      connectionString += `${hostname}`;
    }
    if (mongoHostsArray.length < 1) {
      connectionString += ',';
    }
  });
  if (mongoConfig.dbName) {
    connectionString += `/${mongoConfig.dbName}`;
  }
  console.log(connectionString);
  return connectionString;
};
