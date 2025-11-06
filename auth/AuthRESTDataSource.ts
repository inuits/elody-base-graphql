import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import { BodyInit, RequestInit } from 'apollo-server-env';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { manager } from '.';
import { RequestWithBody } from '@apollo/datasource-rest/dist/RESTDataSource';
import { GraphQLError } from 'graphql/index';
import { Environment } from '../types/environmentTypes';
import { AuthTokenManager } from './authTokenManager';

export class AuthRESTDataSource extends RESTDataSource {
  protected environment: Environment;
  protected session: any;
  protected clientIp: string | undefined;
  protected context: any;
  private requestId?: string;
  private tokenManager: AuthTokenManager;

  constructor(options: {
    environment: Environment;
    session: any;
    cache?: KeyValueCache;
    clientIp?: string;
    context?: any;
  }) {
    super(options);
    this.environment = options.environment;
    this.session = options.session;
    this.clientIp = options.clientIp;
    this.context = options.context;
    this.tokenManager = new AuthTokenManager(
      this.environment,
      this.session,
      this.clientIp
    );
  }

  async willSendRequest(_path: string, request: AugmentedRequest) {
    const requestId =
      this.context?.requestId ||
      this.requestId ||
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    this.requestId = requestId;
    if (this.context && !this.context.requestId)
      this.context.requestId = requestId;
    request.headers['X-request-id'] = requestId;

    const token = await this.tokenManager.getValidToken();
    if (token) request.headers['Authorization'] = `Bearer ${token}`;

    const tenant = this.session?.tenant;
    if (tenant) request.headers['X-tenant-id'] = tenant;
  }

  private async withRetry<T extends any[], S, F extends (...args: T) => S>(
    fn: F,
    ...args: T
  ): Promise<S> {
    try {
      return await fn(...args);
    } catch (error: any) {
      if (this.session.auth && error?.extensions?.response?.status === 401) {
        const response = await manager?.refresh(
          this.session.auth.accessToken,
          this.session.auth.refreshToken
        );

        if (!response) {
          throw new GraphQLError(`AUTH | REFRESH FAILED`, {
            extensions: {
              statusCode: 401,
            },
          });
        }

        this.session.auth = response;

        return await fn(...args);
      } else {
        throw error;
      }
    }
  }

  public async get<TResult = any>(
    path: string,
    params?: any,
    init?: RequestInit
  ): Promise<TResult> {
    return this.withRetry(super.get.bind(this) as any, path, params, init);
  }

  public async post<TResult = any>(
    path: string,
    body?: BodyInit | object,
    init?: RequestInit
  ): Promise<TResult> {
    return this.withRetry(super.post.bind(this) as any, path, body, init);
  }

  protected async patch<TResult = any>(
    path: string,
    body?: BodyInit | object,
    init?: RequestInit
  ): Promise<TResult> {
    return this.withRetry(super.patch.bind(this) as any, path, body, init);
  }

  protected async put<TResult = any>(
    path: string,
    body?: BodyInit | object,
    init?: RequestInit
  ): Promise<TResult> {
    return this.withRetry(super.put.bind(this) as any, path, body, init);
  }

  protected async delete<TResult = any>(
    path: string,
    params?: RequestWithBody,
    init?: RequestInit
  ): Promise<TResult> {
    return this.withRetry(super.delete.bind(this) as any, path, params, init);
  }
}
