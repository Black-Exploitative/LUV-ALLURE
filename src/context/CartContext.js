import  { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';


const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const addToCart = () => setCartItemCount((prev) => prev + 1);

  return (
    <CartContext.Provider value={{ cartItemCount, addToCart }}>
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
