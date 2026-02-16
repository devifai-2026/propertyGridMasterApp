import { useState } from 'react';
import { apiCall } from '../../api';

export const useAuthAPIs = () => {
  const [loading, setLoading] = useState(false);

  const login = (
    payload: {
      mobileNumber: string;
      otp: string;
      verificationId: string;
      roleName?: string;
    },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/login',
      payload,
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const signup = (
    payload: {
      mobileNumber: string;
      email: string;
      firstName: string;
      lastName: string;
      roleName: string;
      otp: string;
      verificationId: string;
      reraNumber?: string;
    },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/signup',
      payload,
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const sendOtp = (
    payload: { mobileNumber: string },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/send-otp',
      payload,
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const verifyOtp = (
    payload: { otp: string; verificationId: string },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/verify-otp',
      payload,
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const logout = (
    refreshToken: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/logout',
      payload: {},
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  return {
    loading,
    login,
    signup,
    sendOtp,
    verifyOtp,
    logout,
  };
};
