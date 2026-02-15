import { useState } from 'react';
import { apiCall } from '../../api';
import { decodeResponseData } from '../../api/decoder';

export const usePropertyAPIs = () => {
  const [loading, setLoading] = useState(false);

  const getProperties = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/properties',
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data));
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const createProperty = (
    payload: FormData,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/properties',
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

  const getAmenities = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/amenities',
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data));
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getCaretakers = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/caretakers',
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data));
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  return {
    getProperties,
    createProperty,
    getAmenities,
    getCaretakers,
    loading,
  };
};
