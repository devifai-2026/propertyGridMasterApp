import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BASE_URL } from "../environments";
import { getHeaders } from "./headers";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig<T = any> {
  route: string;
  payload?: T | null;
  params?: Record<string, any> | null;
  setLoading?: ((loading: boolean) => void) | null;
  onSuccess?: ((data: any) => void) | null;
  onError?: ((error: any) => void) | null;
  afterCall?: (() => void) | null;
}

export const request = async <T = any, R = any>(
  method: HttpMethod,
  {
    route,
    payload = null,
    params = null,
    setLoading = null,
    onSuccess = null,
    onError = null,
    afterCall = null,
  }: RequestConfig<T>
): Promise<R | undefined> => {
  if (setLoading) setLoading(true);

  try {
    const headers = await getHeaders();
    const isExternal =
      route.startsWith("http://") || route.startsWith("https://");

    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
    const url = isExternal ? route : `${BASE_URL}${normalizedRoute}`;

    const options: AxiosRequestConfig = {
      method,
      url,
      headers,
      params: params ?? undefined,
      paramsSerializer: {
        serialize: (params: Record<string, any>) => {
          const parts: string[] = [];
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
              const quotedValues = value.map((v) => `'${v}'`).join(",");
              parts.push(`${key}=[${quotedValues}]`);
            } else if (value !== null && value !== undefined) {
              parts.push(`${key}=${encodeURIComponent(value)}`);
            }
          });
          return parts.join("&");
        },
      },
      ...(payload ? { data: payload } : {}),
    };

    if (payload instanceof FormData) {
      delete (options.headers as Record<string, string>)["Content-Type"];
    }

    const response = await axios(options);

    if (onSuccess) onSuccess(response.data);
    return response.data;
  } catch (error) {
      console.error(`Unexpected Error (${method} ${route}):`, error);
      if (onError) onError(error);
      else throw error;
  } finally {
    if (setLoading) setLoading(false);
    if (afterCall) afterCall();
  }
};
