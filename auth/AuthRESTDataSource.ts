import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import { BodyInit, RequestInit } from 'apollo-server-env';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { manager } from '.';
import { RequestWithBody } from '@apollo/datasource-rest/dist/RESTDataSource';
import { GraphQLError } from 'graphql/index';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export class AuthRESTDataSource extends RESTDataSource {
  protected session: any;
  protected clientIp: string | undefined;
  protected context: any;
  private requestId?: string;
  environment: Environment = getCurrentEnvironment();

  constructor(options: {
    session: any;
    cache?: KeyValueCache;
    clientIp?: string;
    context?: any;
  }) {
    super(options);
    this.session = options.session;
    this.clientIp = options.clientIp;
    this.context = options.context;
  }

  async willSendRequest(_path: string, request: AugmentedRequest) {
    const start = Date.now();
    // Ensure a stable requestId for the lifetime of this datasource instance
    const requestId =
      (this.context?.requestId as string) ||
      this.requestId ||
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    this.requestId = requestId;

    if (this.context && !this.context.requestId) {
      this.context.requestId = requestId;
    }

    if (request.headers) {
      request.headers['X-request-id'] = requestId;
    }

    console.log(
      `[Request Start][${requestId}] ${_path} at ${new Date(
        start
      ).toISOString()}`
    );

    const accessToken = this.session?.auth?.accessToken;

    if (accessToken && accessToken !== 'undefined' && request.headers) {
      request.headers['Authorization'] = 'Bearer ' + accessToken;
    } else {
      const ipWhitelistFeature = this.environment?.features?.ipWhiteListing;

      if (
        ipWhitelistFeature &&
        this.hasWhiteListingFeature() &&
        this.isIpAddressWhiteListed()
      ) {
        request.headers['Authorization'] =
          'Bearer ' + ipWhitelistFeature.tokenToUseForWhiteListedIpAddresses;
      } else if (process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() !== 'true') {
        throw new GraphQLError(`AUTH | NO TOKEN`, {
          extensions: {
            statusCode: 401,
          },
        });
      }
    }

    const tenant = this.session.tenant;
    if (request.headers && tenant) {
      request.headers['X-tenant-id'] = tenant;
    }

    const duration = Date.now() - start;
    console.log(`[Request End][${requestId}] ${_path} took ${duration}ms`);
  }

  private hasWhiteListingFeature = (): boolean => {
    return !!this.environment.features.ipWhiteListing;
  };

  private isIpAddressWhiteListed = (): boolean => {
    return Boolean(
      this.clientIp &&
        this.hasWhiteListingFeature() &&
        this.environment.features.ipWhiteListing?.whiteListedIpAddresses.includes(
          this.clientIp
        )
    );
  };

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
