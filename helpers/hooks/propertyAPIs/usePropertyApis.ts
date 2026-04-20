import { useState } from 'react';
import { apiCall } from '../../api';
import { decodeResponseData } from '../../api/decoder';

export const usePropertyAPIs = () => {
  const [loading, setLoading] = useState(false);

  const getProperties = (
    onSuccess?: (data: any, meta?: any) => void,
    onError?: (error: any) => void,
    query?: string,
  ) => {
    apiCall.get({
      route: `/v1/properties${query ? `?${query}` : ''}`,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data, data);
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

  const getBrokers = (
    onSuccess?: (data: any, meta?: any) => void,
    onError?: (error: any) => void,
    query?: string,
  ) => {
    apiCall.get({
      route: `/v1/brokers${query ? `?${query}` : ''}`,
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data), data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getPropertyCounts = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/properties/counts',
      onSuccess: data => {
        if (onSuccess) onSuccess(decodeResponseData(data.data));
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getWishlist = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/wishlist',
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };
 
  const toggleLikeProperty = (
    propertyId: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: `/v1/properties/${propertyId}/like`,
      payload: {},
      onSuccess: data => {
        if (onSuccess) onSuccess(data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };
 
  const checkIfLiked = (
    propertyId: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: `/v1/properties/${propertyId}/like`,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };
 
  const getMyInquiries = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
    query?: string,
  ) => {
    apiCall.get({
      route: `/v1/my-inquiries${query ? `?${query}` : ''}`,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getInquiryById = (
    id: string,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: `/v1/inquiries/${id}`,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };
 
  const getBrokerStats = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.get({
      route: '/v1/brokers/stats',
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data);
      },
      onError: error => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const calculatePLG = (
    payload: {
      carpetArea: number;
      purchasePrice: number;
      monthlyRent: number;
      securityDeposit: number;
      rentEscalationPercent: number;
      rentEscalationEveryHowManyYears: number;
      leaseStartDate: string;
      leaseTermYears: number;
      propertyTax: number;
      maintenancePerSqFtPerMonth: number;
      insurance: number;
      stampDutyPercent: number;
      legalFees: number;
      brokerage: number;
      otherOneTimeCosts: number;
      propertyType: string;
    },
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => {
    apiCall.post({
      route: '/v1/calculator/plg',
      payload,
      onSuccess: data => {
        if (onSuccess) onSuccess(data.data || data);
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
    getPropertyCounts,
    getBrokers,
    getWishlist,
    toggleLikeProperty,
    checkIfLiked,
    getMyInquiries,
    getInquiryById,
    getBrokerStats,
    calculatePLG,
    loading,
  };
};
