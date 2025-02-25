import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAlreadyInCartModalOpen, setIsAlreadyInCartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
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

  // Add product to cart
  const addToCart = (item) => {
    // Check if the product is already in cart using our improved method
    if (isInCart(item)) {
      setSelectedProduct(item);
      setIsAlreadyInCartModalOpen(true);
      return false; // Indicate product was not added
    }
    
    // Add the product with a generated ID if it doesn't have one
    const itemWithId = {
      ...item,
      id: generateProductId(item),
      dateAdded: new Date().toISOString()
    };
    
    setCartItems((prevItems) => [...prevItems, itemWithId]);
    setSelectedProduct(item);
    setIsCartDrawerOpen(true);
    return true; // Indicate product was added
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
        
        return {
          itemCount: totals.itemCount + 1,
          subtotal: totals.subtotal + itemPrice
        };
      },
      { itemCount: 0, subtotal: 0 }
    );
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
      selectedProduct
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