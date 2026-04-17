import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePropertyAPIs } from '../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  likedPropertyIds: Set<string>;
  toggleLike: (propertyId: string) => Promise<boolean>;
  isLiked: (propertyId: string) => boolean;
  refreshWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, user } = useAuth();
  const { getWishlist, toggleLikeProperty } = usePropertyAPIs();
  const [likedPropertyIds, setLikedPropertyIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = () => {
    if (!isLoggedIn || !user) {
      setLikedPropertyIds(new Set());
      return;
    }

    setIsLoading(true);
    getWishlist(
      (data: any) => {
        if (data && Array.isArray(data)) {
          const ids = new Set(data.map((item: any) => item.propertyId));
          setLikedPropertyIds(ids);
        }
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    refreshWishlist();
  }, [isLoggedIn, user?.userId]);

  const toggleLike = async (propertyId: string): Promise<boolean> => {
    if (!isLoggedIn) return false;

    return new Promise((resolve) => {
      toggleLikeProperty(propertyId, (res: any) => {
        if (res.success) {
          setLikedPropertyIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(propertyId)) {
              newSet.delete(propertyId);
            } else {
              newSet.add(propertyId);
            }
            return newSet;
          });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  const isLiked = (propertyId: string) => {
    return likedPropertyIds.has(propertyId);
  };

  return (
    <WishlistContext.Provider
      value={{
        likedPropertyIds,
        toggleLike,
        isLiked,
        refreshWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
