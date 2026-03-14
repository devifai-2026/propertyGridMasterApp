import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../environments';
import { getHeaders } from './headers';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig<T = any> {
  route: string;
  payload?: T | null;
  params?: Record<string, any> | null;
  setLoading?: ((loading: boolean) => void) | null;
  onSuccess?: ((data: any) => void) | null;
  onError?: ((error: any) => void) | null;
  afterCall?: (() => void) | null;
  headers?: Record<string, string> | null;
}

export const request = async <T = any, R = any>(
  method: HttpMethod,
  config: RequestConfig<T>,
): Promise<R | undefined> => {
  const {
    route,
    payload = null,
    params = null,
    setLoading = null,
    onSuccess = null,
    onError = null,
    afterCall = null,
    headers: configHeaders = null,
  } = config;

  if (setLoading) setLoading(true);

  try {
    const defaultHeaders = await getHeaders();
    const isExternal =
      route.startsWith('http://') || route.startsWith('https://');

    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    const url = isExternal ? route : `${BASE_URL}${normalizedRoute}`;

    const headers = { ...defaultHeaders, ...(configHeaders || {}) };

    const options: AxiosRequestConfig = {
      method,
      url,
      headers,
      params: params ?? undefined,
      paramsSerializer: {
        serialize: (params: Record<string, any>) => {
          const parts: string[] = [];
          Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
              const quotedValues = value.map(v => `'${v}'`).join(',');
              parts.push(`${key}=[${quotedValues}]`);
            } else if (value !== null && value !== undefined) {
              parts.push(`${key}=${encodeURIComponent(value)}`);
            }
          });
          return parts.join('&');
        },
      },
      ...(payload ? { data: payload } : {}),
    };

    if (payload instanceof FormData) {
      delete (options.headers as Record<string, string>)['Content-Type'];
    }

    const response = await axios(options);

    // Automatically decode data if it's encoded/compressed
    if (response.data && response.data.data) {
      const { decodeResponseData } = require('./decoder');
      response.data.data = decodeResponseData(response.data.data);
    }

    if (onSuccess) onSuccess(response.data);
    return response.data;
  } catch (error: any) {
    // Handle 401 Unauthorized (Resulting from expired access token)
    const isTokenExpired =
      error.response?.status === 401 || error.response?.data?.expired === true;

    if (isTokenExpired && !route.includes('refresh-token')) {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const refreshToken = user.refreshToken;

          if (refreshToken) {

            // Call refresh token API directly with axios to avoid recursion loops
            // The backend endpoint is GET /api/v1/refresh-token
            // BASE_URL already includes /api, but backend expects /api/v1/refresh-token
            // We'll construct the path carefully.
            const refreshUrl = `${BASE_URL.replace(
              /\/api$/,
              '',
            )}/api/v1/refresh-token`;

            const refreshResponse = await axios.get(refreshUrl, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            });

            if (
              refreshResponse.data &&
              refreshResponse.data.success &&
              refreshResponse.data.data
            ) {
              const { decodeResponseData } = require('./decoder');
              let refreshedData = refreshResponse.data.data;

              // Decode if it's an encoded string
              if (typeof refreshedData === 'string') {
                refreshedData = decodeResponseData(refreshedData);
              }

              const { accessToken } = refreshedData;

              // Update stored user with new access token
              // The app expects 'token' field for the access token as seen in headers.ts
              const updatedUser = { ...user, token: accessToken };

              await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

              // Retry the original request
              return await request<T, R>(method, config);
            }
          }
        }
      } catch (refreshError: any) {
        console.error(
          'Token refresh failed:',
          refreshError?.response?.data || refreshError.message,
        );
        // If refresh fails, we might want to log out the user
        // await AsyncStorage.removeItem('user');
      }
    }

    console.error(`Unexpected Error (${method} ${route}):`, error);
    if (onError) onError(error);
    else throw error;
  } finally {
    if (setLoading) setLoading(false);
    if (afterCall) afterCall();
  }
};
