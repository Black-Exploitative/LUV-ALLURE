import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import orderHistoryReducer from './orderHistorySlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'orderHistory'], // Persist only these slices
};

// Create persisted reducers
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(persistConfig, wishlistReducer);
const persistedOrderHistoryReducer = persistReducer(persistConfig, orderHistoryReducer);

// Store setup
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    orderHistory: persistedOrderHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

// Persistor for store
export const persistor = persistStore(store);
export default store;
