// frontend/src/components/DropdownMenu.jsx - Updated to fetch dynamic collections
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DropdownMenu = ({ isVisible, onMouseEnter, onMouseLeave }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections');
        if (response.data.success) {
          setCollections(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="absolute top-full left-0 w-screen bg-white shadow-lg z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* First column - Dynamic Collections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">COLLECTIONS</h3>
            <ul className="space-y-2">
              {loading ? (
                <li className="text-gray-500">Loading...</li>
              ) : (
                collections.map((collection) => (
                  <li key={collection._id}>
                    <Link
                      to={`/collections/${collection.handle}`}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      {collection.name}
                    </Link>
                  </li>
                ))
              )}
              {!loading && collections.length === 0 && (
                <li>
                  <Link to="/collections" className="text-sm text-gray-600 hover:text-black">
                    View All Collections
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Second column - Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=dresses" className="text-sm text-gray-600 hover:text-black">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tops" className="text-sm text-gray-600 hover:text-black">
                  Tops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bottoms" className="text-sm text-gray-600 hover:text-black">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link to="/shop?category=outerwear" className="text-sm text-gray-600 hover:text-black">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-sm text-gray-600 hover:text-black">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Third column - Featured */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">FEATURED</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?sort=newest" className="text-sm text-gray-600 hover:text-black">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=best-selling" className="text-sm text-gray-600 hover:text-black">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=true" className="text-sm text-gray-600 hover:text-black">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth column - Promo Image */}
          <div className="relative">
            <Link to="/collections/featured" className="block">
              <img
                src="/images/collection-promo.jpg"
                alt="Featured Collection"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-lg font-medium">Featured Collection</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;