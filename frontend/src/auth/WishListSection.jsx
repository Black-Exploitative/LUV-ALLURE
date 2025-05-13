// Update UserAccount.jsx wishlist section
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, WishlistItemComponent } from '../context/WishlistContext';

const WishlistSection = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="py-12 text-center border border-gray-200">
        <p className="text-gray-600 mb-4">
          Your wishlist is empty.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-black text-white text-sm"
        >
          EXPLORE COLLECTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wishlistItems.map(item => (
        <WishlistItemComponent 
          key={item.id} 
          item={item} 
          onRemove={removeFromWishlist} 
        />
      ))}
    </div>
  );
};

export default WishlistSection;