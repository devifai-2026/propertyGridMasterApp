import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '../components/PropertyCard';

const STORAGE_KEY = '@compare_properties';

interface CompareContextType {
  selectedProperties: Property[];
  toggleCompare: (prop: Property) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isSelected: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) {
        try { setSelectedProperties(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  const persist = (props: Property[]) => {
    setSelectedProperties(props);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(props));
  };

  const toggleCompare = (prop: Property) => {
    const exists = selectedProperties.some(p => p.id === prop.id);
    if (exists) {
      persist(selectedProperties.filter(p => p.id !== prop.id));
    } else if (selectedProperties.length < 3) {
      persist([...selectedProperties, prop]);
    }
  };

  const removeFromCompare = (id: string) => {
    persist(selectedProperties.filter(p => p.id !== id));
  };

  const clearCompare = () => persist([]);

  const isSelected = (id: string) => selectedProperties.some(p => p.id === id);

  return (
    <CompareContext.Provider value={{ selectedProperties, toggleCompare, removeFromCompare, clearCompare, isSelected }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
