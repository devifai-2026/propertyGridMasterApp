import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../environments';
import { getHeaders } from './headers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeResponseData } from './decoder';

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

// Single-flight refresh: all concurrent 401s share one in-flight refresh promise.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      const refreshToken = user.refreshToken;
      if (!refreshToken) return null;

      // BASE_URL ends with /api → server route is /api/v1/refresh-token
      const refreshUrl = `${BASE_URL.replace(/\/api$/, '')}/api/v1/refresh-token`;
      const refreshResponse = await axios.get(refreshUrl, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      if (!refreshResponse.data?.success || !refreshResponse.data?.data) {
        return null;
      }

      let refreshedData = refreshResponse.data.data;
      if (typeof refreshedData === 'string') {
        refreshedData = decodeResponseData(refreshedData);
      }

      const { accessToken } = refreshedData || {};
      if (!accessToken) return null;

      const latestUserStr = await AsyncStorage.getItem('user');
      const latestUser = latestUserStr ? JSON.parse(latestUserStr) : user;
      const updatedUser = {
        ...latestUser,
        token: accessToken,
        accessToken,
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return accessToken;
    } catch (err) {
      return null;
    } finally {
      // Clear the in-flight promise on the next tick so callers awaiting it
      // resolve first, but new 401s after this point trigger a fresh refresh.
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();

  return refreshPromise;
};

const handleRefreshFailure = async () => {
  // Refresh truly failed (refresh token invalid/expired) → clear auth and kick the
  // user out to login, instead of bubbling the 401 to the UI as "access token expired".
  try {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'token', 'isLoggedIn']);
  } catch {}
  // On web, force navigation to the login screen.
  try {
    const w: any = typeof window !== 'undefined' ? window : null;
    if (w?.location && !String(w.location.pathname).startsWith('/login')) {
      w.location.href = '/login';
    }
  } catch {}
};

export const request = async <T = any, R = any>(
  method: HttpMethod,
  config: RequestConfig<T>,
  _isRetry = false,
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
        serialize: (p: Record<string, any>) => {
          const parts: string[] = [];
          Object.keys(p).forEach(key => {
            const value = p[key];
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

    if (response.data && response.data.data) {
      response.data.data = decodeResponseData(response.data.data);
    }

    if (onSuccess) onSuccess(response.data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const serverExpiredFlag = error.response?.data?.expired === true;
    const isAuthFailure = status === 401 || serverExpiredFlag;
    const isRefreshRoute = route.includes('refresh-token');

    if (isAuthFailure && !isRefreshRoute && !_isRetry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry once with the freshly stored token. Pass _isRetry=true to
        // prevent infinite loops if the retry also fails with 401.
        return await request<T, R>(method, config, true);
      }
      // Refresh failed → clear auth so the UI stops looping on 401s.
      await handleRefreshFailure();
    }

    if (onError) onError(error);
    else throw error;
  } finally {
    if (setLoading) setLoading(false);
    if (afterCall) afterCall();
  }
};
