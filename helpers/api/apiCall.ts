import { request, RequestConfig } from "./request";

export const apiCall = {
  get: <T = any, R = any>(config: RequestConfig<T>) => request<T, R>("GET", config),
  post: <T = any, R = any>(config: RequestConfig<T>) => request<T, R>("POST", config),
  put: <T = any, R = any>(config: RequestConfig<T>) => request<T, R>("PUT", config),
  patch: <T = any, R = any>(config: RequestConfig<T>) => request<T, R>("PATCH", config),
  delete: <T = any, R = any>(config: RequestConfig<T>) => request<T, R>("DELETE", config),
};

export { request, type RequestConfig } from "./request";
export { getHeaders } from "./headers";
