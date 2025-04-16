// frontend/src/context/WishlistContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        // If user is logged in, try to get wishlist from the server
        if (currentUser && currentUser.id) {
          try {
            // This would be a real API call in a complete implementation
            // const response = await api.get('/wishlist');
            // setWishlistItems(response.data.items);
            
            // For now, we'll use localStorage as our "database"
            const savedWishlist = localStorage.getItem(`wishlist-${currentUser.id}`);
            if (savedWishlist) {
              setWishlistItems(JSON.parse(savedWishlist));
            }
          } catch (error) {
            console.error('Error fetching wishlist from API:', error);
            // Fallback to localStorage if API fails
            const savedWishlist = localStorage.getItem(`wishlist-${currentUser.id}`);
            if (savedWishlist) {
              setWishlistItems(JSON.parse(savedWishlist));
            }
          }
        } else {
          // For guests, use localStorage
          const savedWishlist = localStorage.getItem('wishlist-guest');
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [currentUser]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (loading) return; // Don't save during initial load
    
    try {
      if (currentUser && currentUser.id) {
        localStorage.setItem(`wishlist-${currentUser.id}`, JSON.stringify(wishlistItems));
        
        // In a real implementation, also save to the server
        // api.post('/wishlist', { items: wishlistItems });
      } else {
        localStorage.setItem('wishlist-guest', JSON.stringify(wishlistItems));
      }
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, [wishlistItems, currentUser, loading]);

  // Count wishlist items
  const wishlistItemCount = wishlistItems.length;

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Add product to wishlist
  const addToWishlist = (product) => {
    if (isInWishlist(product.id)) {
      return false; // Already in wishlist
    }
    
    // Create a simplified version of the product for the wishlist
    const wishlistItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : (product.image || '/images/placeholder.jpg'),
      addedAt: new Date().toISOString()
    };
    
    setWishlistItems(prevItems => [...prevItems, wishlistItem]);
    toast.success('Added to wishlist');
    return true;
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.success('Removed from wishlist');
  };

  // Toggle wishlist status (add if not in wishlist, remove if already in wishlist)
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false; // Indicates item was removed
    } else {
      addToWishlist(product);
      return true; // Indicates item was added
    }
  };

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      wishlistItemCount,
      loading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};