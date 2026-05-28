import { Configuration } from './configuration';

export const url = (path: string) => `${Configuration.apiBaseUrl}${path}`;

export type ResponseType = 'json' | 'blob' | 'text';

export interface HttpRequestConfig
  extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  headers?: HeadersInit;
  responseType?: ResponseType;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class HttpRequestError<T = any> extends Error {
  response: HttpResponse<T>;

  constructor(response: HttpResponse<T>) {
    super(
      response.statusText || `Request failed with status ${response.status}`
    );
    this.name = 'HttpRequestError';
    this.response = response;
  }
}

const API_ORIGIN = new URL(Configuration.apiBaseUrl).origin;

const getToken = () => {
  if (typeof localStorage === 'undefined') return null;

  return localStorage.getItem('token');
};

const isBodyLike = (value: unknown): value is BodyInit =>
  typeof value === 'string' ||
  value instanceof FormData ||
  value instanceof Blob ||
  value instanceof URLSearchParams ||
  value instanceof ArrayBuffer ||
  ArrayBuffer.isView(value);

const buildHeaders = (
  providedHeaders: HeadersInit | undefined,
  requestUrl: URL
) => {
  const headers = new Headers(providedHeaders);

  if (requestUrl.origin === API_ORIGIN && !headers.has('Authorization')) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
};

const serializeBody = (
  body: unknown,
  headers: Headers
): BodyInit | undefined => {
  if (body === undefined || body === null) return undefined;
  if (isBodyLike(body)) return body;

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return JSON.stringify(body);
};

const parseResponse = async <T = any>(
  response: Response,
  responseType: ResponseType
): Promise<T> => {
  if (responseType === 'blob') {
    return (await response.blob()) as T;
  }

  if (responseType === 'text') {
    return (await response.text()) as T;
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  if (responseType === 'json') {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
  }

  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

const execute = async <T = any>(
  method: string,
  target: string,
  body?: unknown,
  config?: HttpRequestConfig
): Promise<HttpResponse<T>> => {
  const requestUrl = new URL(target, Configuration.apiBaseUrl);
  const { responseType = 'json', headers: providedHeaders, ...requestInit } =
    config ?? {};
  const headers = buildHeaders(providedHeaders, requestUrl);

  const response = await fetch(requestUrl.toString(), {
    ...requestInit,
    method,
    headers,
    body: serializeBody(body, headers),
  });

  const data = await parseResponse<T>(response, responseType);
  const result = {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };

  if (!response.ok) {
    throw new HttpRequestError(result);
  }

  return result;
};

const http = {
  get: <T = any>(target: string, config?: HttpRequestConfig) =>
    execute<T>('GET', target, undefined, config),
  delete: <T = any>(target: string, config?: HttpRequestConfig) =>
    execute<T>('DELETE', target, undefined, config),
  post: <T = any>(target: string, body?: unknown, config?: HttpRequestConfig) =>
    execute<T>('POST', target, body, config),
  put: <T = any>(target: string, body?: unknown, config?: HttpRequestConfig) =>
    execute<T>('PUT', target, body, config),
  patch: <T = any>(
    target: string,
    body?: unknown,
    config?: HttpRequestConfig
  ) => execute<T>('PATCH', target, body, config),
};

export default http;
