import { useState } from 'react';
import { apiCall } from '../../api';

export const useAuthAPIs = () => {
  const [loading, setLoading] = useState(false);

  const login = (
    payload: { mobileNumber: string; otp: string },
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

  return {
    loading,
    login,
    signup,
  };
};
