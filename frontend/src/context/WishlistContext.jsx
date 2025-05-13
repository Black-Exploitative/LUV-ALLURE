// First, let's update the WishlistContext.jsx to ensure it's correctly fetching and storing wishlist items

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
        // If user is logged in, try to get wishlist from the server or localStorage
        if (currentUser && currentUser.id) {
          try {
            // For a real API implementation this would be uncommented
            // const response = await api.get('/wishlist');
            // setWishlistItems(response.data.items);
            
            // Using localStorage for this implementation
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

// Now let's create a WishlistItemComponent to display in UserAccount.jsx
export const WishlistItemComponent = ({ item, onRemove }) => {
  return (
    <div className="border border-gray-200 p-4 rounded-md">
      <div className="flex items-center">
        <div className="w-24 h-24 bg-gray-100 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-sm">{item.name}</h3>
          <p className="text-sm mt-1">₦{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p>
          <div className="mt-2 flex justify-between">
            <button 
              className="text-xs underline"
              onClick={() => onRemove(item.id)}
            >
              REMOVE
            </button>
            <button className="text-xs underline">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

WishlistItemComponent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};