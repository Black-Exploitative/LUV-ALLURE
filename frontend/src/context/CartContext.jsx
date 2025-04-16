import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // Import the API service

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAlreadyInCartModalOpen, setIsAlreadyInCartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingInventory, setIsCheckingInventory] = useState(false);
  
  // Load cart from localStorage on initial render with 1-week expiration check
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const cartTimestamp = localStorage.getItem('cartTimestamp');
    const currentTime = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    
    if (savedCart && cartTimestamp) {
      // Check if cart is still valid (within 1 week)
      if (currentTime - parseInt(cartTimestamp) < oneWeek) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      } else {
        // Clear expired cart
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes, with timestamp
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // Set or update the timestamp when cart is modified
      if (!localStorage.getItem('cartTimestamp')) {
        localStorage.setItem('cartTimestamp', new Date().getTime().toString());
      }
    } else {
      // Clear localStorage if cart is empty
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTimestamp');
    }
  }, [cartItems]);

  const cartItemCount = cartItems.length;

  // Generate a unique ID for a product based on its properties
  const generateProductId = (product) => {
    // If the product already has an ID, use it
    if (product.id) return product.id;
    
    // Otherwise, create a unique ID based on multiple properties
    // Include more properties to make the ID more unique
    const nameStr = product.name || '';
    const sizeStr = product.selectedSize || 'default';
    const colorStr = product.color || '';
    const priceStr = String(product.price || '');
    
    // Concatenate all properties to form a unique identifier
    return `${nameStr}-${sizeStr}-${colorStr}-${priceStr}`;
  };

  // Check if a product is already in the cart
  const isInCart = (product) => {
    const productId = generateProductId(product);
    
    return cartItems.some(item => {
      const itemId = generateProductId(item);
      return itemId === productId;
    });
  };

  // Fetch real-time inventory from Shopify
  const getInventoryAvailability = async (variantId) => {
    try {
      // Normalize the variantId to ensure it matches Shopify's format
      // Remove 'gid://' prefix if present, as some APIs need the raw ID
      let normalizedId = variantId;
      if (typeof variantId === 'string' && variantId.includes('gid://shopify/ProductVariant/')) {
        normalizedId = variantId.split('/').pop();
      }
      
      // Make API call to get inventory data
      const response = await api.get(`/products/inventory/${normalizedId}`);
      
      if (response.data && response.data.success) {
        return {
          available: response.data.available,
          quantity: response.data.quantity || 0
        };
      }
      
      // Fallback if we don't get the expected response structure
      return { available: true, quantity: 999 };
    } catch (error) {
      console.error(`Error checking inventory for variant ${variantId}:`, error);
      // In case of error, allow the operation but log the issue
      return { available: true, quantity: 999 };
    }
  };

  // Update cart item quantity with real-time inventory check
  const updateCartItemQuantity = async (productId, quantity) => {
    setIsCheckingInventory(true);
    
    try {
      // Find the item in the cart
      const item = cartItems.find(item => generateProductId(item) === productId);
      if (!item) {
        setIsCheckingInventory(false);
        return;
      }
      
      // Get the variant ID to check inventory
      const variantId = item.variantId || item.id;
      
      // Check real-time inventory availability
      const inventory = await getInventoryAvailability(variantId);
      
      // Ensure requested quantity doesn't exceed available quantity
      const safeQuantity = Math.min(quantity, inventory.quantity);
      
      // Show warning if requested quantity exceeds available
      if (safeQuantity < quantity) {
        toast.error(`Only ${inventory.quantity} items available in stock`);
      }
      
      // Update the item quantity
      setCartItems(prevItems => 
        prevItems.map(item => 
          generateProductId(item) === productId 
            ? { ...item, quantity: safeQuantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('Could not update quantity. Please try again.');
    } finally {
      setIsCheckingInventory(false);
    }
  };

  // Add product to cart with real-time inventory check
  const addToCart = async (item) => {
    // Check if the product is already in cart
    if (isInCart(item)) {
      setSelectedProduct(item);
      setIsAlreadyInCartModalOpen(true);
      return false; // Indicate product was not added
    }
    
    setIsCheckingInventory(true);
    
    try {
      // Get the variant ID to check inventory
      const variantId = item.variantId || item.id;
      
      // Check real-time inventory availability
      const inventory = await getInventoryAvailability(variantId);
      
      // If the item is not available, show error and return
      if (!inventory.available) {
        toast.error('This item is currently out of stock');
        setIsCheckingInventory(false);
        return false;
      }
      
      // Ensure requested quantity doesn't exceed available quantity
      const requestedQuantity = item.quantity || 1;
      const safeQuantity = Math.min(requestedQuantity, inventory.quantity);
      
      // Show warning if requested quantity exceeds available
      if (safeQuantity < requestedQuantity) {
        toast.error(`Only ${inventory.quantity} items available in stock`);
      }
      
      // Add the product with a generated ID if it doesn't have one
      const itemWithId = {
        ...item,
        id: generateProductId(item),
        dateAdded: new Date().toISOString(),
        quantity: safeQuantity, // Use the safe quantity
        availableQuantity: inventory.quantity // Store the available quantity for future reference
      };
      
      setCartItems((prevItems) => [...prevItems, itemWithId]);
      setSelectedProduct(item);
      setIsCartDrawerOpen(true);
      return true; // Indicate product was added
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Could not add item to cart. Please try again.');
      return false;
    } finally {
      setIsCheckingInventory(false);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => generateProductId(item) !== productId));
  };

  // Calculate cart totals
  const getCartTotals = () => {
    return cartItems.reduce(
      (totals, item) => {
        const itemPrice = typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/,/g, '')) 
          : (parseFloat(item.price) || 0);
        
        const quantity = item.quantity || 1;
        
        return {
          itemCount: totals.itemCount + quantity,
          subtotal: totals.subtotal + (itemPrice * quantity)
        };
      },
      { itemCount: 0, subtotal: 0 }
    );
  };
  
  // Check stock availability for all cart items
  const checkStockAvailability = async () => {
    setIsCheckingInventory(true);
    
    try {
      // Create inventory check promises for all items
      const inventoryChecks = cartItems.map(async (item) => {
        const variantId = item.variantId || item.id;
        const inventory = await getInventoryAvailability(variantId);
        
        return {
          itemId: generateProductId(item),
          available: inventory.available,
          quantity: inventory.quantity,
          requestedQuantity: item.quantity || 1
        };
      });
      
      // Wait for all inventory checks to complete
      const inventoryResults = await Promise.all(inventoryChecks);
      
      // Identify items that need quantity adjustments
      const itemsToAdjust = inventoryResults.filter(result => 
        !result.available || result.requestedQuantity > result.quantity
      );
      
      // If there are items that need adjustment, update quantities and show warnings
      if (itemsToAdjust.length > 0) {
        // Update cart items with adjusted quantities
        setCartItems(prevItems => 
          prevItems.map(item => {
            const inventoryResult = inventoryResults.find(
              result => result.itemId === generateProductId(item)
            );
            
            if (!inventoryResult) return item;
            
            if (!inventoryResult.available) {
              // Item is not available, show error
              toast.error(`${item.name || 'An item'} is no longer available and has been removed from your cart`);
              return null; // Will be filtered out
            } else if (inventoryResult.requestedQuantity > inventoryResult.quantity) {
              // Quantity needs adjustment
              toast.error(`Only ${inventoryResult.quantity} of ${item.name || 'an item'} available - quantity adjusted.`);
              return {
                ...item,
                quantity: inventoryResult.quantity,
                availableQuantity: inventoryResult.quantity
              };
            }
            
            return item;
          }).filter(Boolean) // Remove null items (out of stock)
        );
        
        return false; // Indicate stock check failed
      }
      
      return true; // All items in stock
    } catch (error) {
      console.error('Error checking stock availability:', error);
      toast.error('Could not verify stock availability. Please try again.');
      return false;
    } finally {
      setIsCheckingInventory(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTimestamp');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartItemCount, 
      addToCart,
      removeFromCart,
      isInCart,
      getCartTotals,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      isAlreadyInCartModalOpen,
      setIsAlreadyInCartModalOpen,
      updateCartItemQuantity,
      checkStockAvailability,
      selectedProduct,
      isCheckingInventory,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};