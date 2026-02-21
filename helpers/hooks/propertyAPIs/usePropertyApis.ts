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

  const getPropertyById = (
    id: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: `/v1/properties/${id}`,
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data));
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const createPropertyInquiry = (
    propertyId: string,
    payload: any,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: `/v1/inquiries/properties/${propertyId}`,
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

  const getOwnerNotes = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/owner/notes',
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getPropertyNotesForOwner = (
    propertyId: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: `/v1/owner/properties/${propertyId}/notes`,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const addOwnerNote = (
    propertyId: string,
    note: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: `/v1/owner/properties/${propertyId}/notes`,
      payload: { note },
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const updateProperty = (
    propertyId: string,
    payload: FormData,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.put({
      route: `/v1/properties/${propertyId}`,
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
    getProperties,
    getPropertyById,
    getOwnerNotes,
    getPropertyNotesForOwner,
    addOwnerNote,
    createProperty,
    updateProperty,
    createPropertyInquiry,
    getAmenities,
    getCaretakers,
    loading,
  };
};
