import { BodyInit, RequestInit } from "apollo-server-env";
import {
  RESTDataSource,
  WillSendRequestOptions,
} from "@apollo/datasource-rest";
import { AuthenticationError } from "apollo-server-errors";
import { manager } from ".";
import { envConfig } from "./libConfig";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { RequestWithBody } from "@apollo/datasource-rest/dist/RESTDataSource";

export class AuthRESTDataSource extends RESTDataSource {
  private session: any;

  constructor(options: { session: any; cache?: KeyValueCache }) {
    super(options);
    this.session = options.session;
  }

  async willSendRequest(request: WillSendRequestOptions) {
    const accessToken = this.session?.auth?.accessToken;
    const JWT_TOKEN = accessToken || envConfig.staticJWT;
    request.headers["Content-Type"] = "application/json"
    if (JWT_TOKEN) {
      request.headers["Authorization"] = "Bearer " + JWT_TOKEN;
    } else {
      if (process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() !== "true")
        throw new AuthenticationError(`AUTH | NO TOKEN`, { statusCode: 401 });
    }

    const tenant = this.session.tenant;
    if (request.headers && tenant) {
      request.headers["X-tenant-id"] = tenant;
    }
  }

  private async withRetry<T extends any[], S, F extends (...args: T) => S>(
    fn: F,
    ...args: T
  ): Promise<S> {
    try {
      if (this.session.auth) {
        let time = this.session.auth.expiresIn! - new Date().getTime() / 1000;
        if (time <= 10) {
          this.session.auth = await manager?.refresh(
            this.session.auth.accessToken,
            this.session.auth.refreshToken
          );
        }
      }
      return fn(...args);
    } catch (error: any) {
      if (this.session.auth) {
        if (error.extensions && error.extensions.response) {
          const response = error.extensions.response;
          if (response.status && response.status === 401) {
            this.session.auth = await manager?.refresh(
              this.session.auth.accessToken,
              this.session.auth.refreshToken
            );
            console.log(`\n the refresh done now retry call`);
            // In the frontend the call is not retried...
          } else {
            throw Error(error);
          }
        }
      }
    }
    return new Promise((resolve) => resolve(fn(...args)));
  }

  protected async get<TResult = any>(
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
