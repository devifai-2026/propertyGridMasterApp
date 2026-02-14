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

  return {
    getProperties,
    loading,
  };
};
