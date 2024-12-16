import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import { BodyInit, RequestInit } from 'apollo-server-env';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { manager } from '.';
import { RequestWithBody } from '@apollo/datasource-rest/dist/RESTDataSource';
import { GraphQLError } from 'graphql/index';

export class AuthRESTDataSource extends RESTDataSource {
  protected session: any;

  constructor(options: { session: any; cache?: KeyValueCache }) {
    super(options);
    this.session = options.session;
  }

  async willSendRequest(_path: string, request: AugmentedRequest) {
    const accessToken = this.session?.auth?.accessToken;
    if (accessToken && accessToken !== 'undefined' && request.headers) {
      request.headers['Authorization'] = 'Bearer ' + accessToken;
    } else {
      if (process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() !== 'true')
        throw new GraphQLError(`AUTH | NO TOKEN`, {
          extensions: {
            statusCode: 401,
          },
        });
    }

    const tenant = this.session.tenant;
    if (request.headers && tenant) {
      request.headers['X-tenant-id'] = tenant;
    }
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
