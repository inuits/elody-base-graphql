import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import { BodyInit, RequestInit } from 'apollo-server-env';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { manager } from '.';
import { RequestWithBody } from '@apollo/datasource-rest/dist/RESTDataSource';
import { GraphQLError } from 'graphql/index';
import { environment } from '../main';
import { trace, context, propagation } from '@opentelemetry/api';

export class AuthRESTDataSource extends RESTDataSource {
  protected session: any;
  protected clientIp: string | undefined;
  protected context: any;
  private requestId?: string;

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

  tracer = trace.getTracer('elody-graphql');

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
      `[Request Start][${requestId}] ${_path} at ${new Date(start).toISOString()}`
    );

    const accessToken = this.session?.auth?.accessToken;

    if (accessToken && accessToken !== 'undefined' && request.headers) {
      request.headers['Authorization'] = 'Bearer ' + accessToken;
    } else {
      const ipWhitelistFeature = environment?.features?.ipWhiteListing;

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
    return !!(environment && environment.features.ipWhiteListing);
  };

  private isIpAddressWhiteListed = (): boolean => {
    return Boolean(
      environment &&
        this.clientIp &&
        this.hasWhiteListingFeature() &&
        environment.features.ipWhiteListing?.whiteListedIpAddresses.includes(
          this.clientIp
        )
    );
  };

  private async withRetry<T extends any[], S, F extends (...args: T) => S>(
    fn: F,
    ...args: T
  ): Promise<S> {
    const span = this.tracer.startSpan(`HTTP ${args[0]}`, {
      attributes: {
        'http.path': args[0],
        'http.method': (fn as any).name.toUpperCase(),
      },
    });

    if (!args[2]) args[2] = {};
    if (!args[2].headers) args[2].headers = {};
    propagation.inject(context.active(), args[2].headers);

    try {
      const result = await fn(...args);
      span.setStatus({ code: 1 });
      return result;
    } catch (error: any) {
      if (this.session.auth && error?.extensions?.response?.status === 401) {
        try {
          const response = await manager?.refresh(
            this.session.auth.accessToken,
            this.session.auth.refreshToken
          );

          if (!response) {
            span.recordException(error);
            span.setStatus({ code: 2, message: 'AUTH REFRESH FAILED' });
            span.setAttribute('request.id', this.requestId);
            span.setAttribute('entity.type', args[0]);
            throw new GraphQLError(`AUTH | REFRESH FAILED`, {
              extensions: {
                statusCode: 401,
              },
            });
          }

          this.session.auth = response;

          return await fn(...args);
        } catch (refreshError) {
          span.recordException(refreshError);
          span.setStatus({ code: 2, message: 'AUTH REFRESH FAILED' });
          span.setAttribute('request.id', this.requestId);
          span.setAttribute('entity.type', args[0]);
          throw refreshError;
        }
      } else {
        span.recordException(error);
        span.setStatus({ code: 2, message: (error as Error).message });
        span.setAttribute('request.id', this.requestId);
        span.setAttribute('entity.type', args[0]);
        throw error;
      }
    } finally {
      span.end();
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
