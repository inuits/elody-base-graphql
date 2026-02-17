export declare const logToken: (_accesstoken: string | undefined, _subject: string, _context?: string, full?: boolean) => void;
export declare const logUser: (accessToken: string | undefined) => void;
export declare const logTime: () => void;
export declare const logRefreshConfig: (_endpoint: string, _body: URLSearchParams) => void;
