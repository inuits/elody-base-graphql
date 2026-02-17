import { Module } from 'graphql-modules';
import { DataSources, OptionalDataSources } from '../types';
import { AuthRESTDataSource } from '../main';
import { Environment } from '../types/environmentTypes';
export type ElodyModuleConfig = {
    modules: Module[];
    dataSources: {
        [key: string]: new ({ session, cache, }: {
            environment: Environment;
            session: any;
            cache: any;
            clientIp: string;
        }) => AuthRESTDataSource;
    } | undefined;
};
export type ElodyConfig = {
    modules: Module[];
    dataSources: ((environment: Environment, session: any, cache: any, clientIp: string) => OptionalDataSources)[];
};
export declare const addAdditionalOptionalDataSources: (environment: Environment) => void;
export declare const createFullElodyConfig: (customElodyConfig: ElodyConfig) => ElodyConfig;
export declare const getDataSourcesFromMapping: (ElodyConfig: ElodyConfig, environment: Environment, session: any, cache: any, clientIp: string) => DataSources;
export declare const isRequiredDataSources: (dataSources: OptionalDataSources) => dataSources is DataSources;
export declare const generateElodyConfig: (elodyModuleConfig: ElodyModuleConfig) => ElodyConfig;
