import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import { BodyInit, RequestInit } from 'apollo-server-env';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { RequestWithBody } from '@apollo/datasource-rest/dist/RESTDataSource';
import { Environment } from '../types/environmentTypes';
export declare class AuthRESTDataSource extends RESTDataSource {
    protected environment: Environment;
    protected session: any;
    protected clientIp: string | undefined;
    protected context: any;
    private requestId?;
    private tokenManager;
    constructor(options: {
        environment: Environment;
        session: any;
        cache?: KeyValueCache;
        clientIp?: string;
        context?: any;
    });
    willSendRequest(_path: string, request: AugmentedRequest): Promise<void>;
    private withRetry;
    get<TResult = any>(path: string, params?: any, init?: RequestInit): Promise<TResult>;
    post<TResult = any>(path: string, body?: BodyInit | object, init?: RequestInit): Promise<TResult>;
    protected patch<TResult = any>(path: string, body?: BodyInit | object, init?: RequestInit): Promise<TResult>;
    protected put<TResult = any>(path: string, body?: BodyInit | object, init?: RequestInit): Promise<TResult>;
    protected delete<TResult = any>(path: string, params?: RequestWithBody, init?: RequestInit): Promise<TResult>;
}
