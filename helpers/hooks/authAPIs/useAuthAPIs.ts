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
      joinType: string;
      otp: string;
      verificationId: string;
      reraNumber?: string;
      locality?: string;
      specializations?: string[];
      dealsClosed?: number;
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

  const changeMobile = (
    payload: { newMobileNumber: string; otp: string; verificationId: string },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.patch({
      route: '/v1/change-mobile',
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

  const switchRole = (
    payload: { roleName: string },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/switch-role',
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

  const getAvailableRoles = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/available-roles',
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getBrokerProfile = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/brokers/profile',
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
    switchRole,
    logout,
    changeMobile,
    getAvailableRoles,
    getBrokerProfile,
  };
};
