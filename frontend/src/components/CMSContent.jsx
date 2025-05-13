// frontend/src/components/CMSContent.jsx
// This component makes it easy to display CMS content anywhere in the app

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cmsService from '../services/cmsService';

const CMSContent = ({ 
  type, 
  identifier, 
  fallback = null,
  renderLoading = null,
  renderError = null,
  render = null
}) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        let fetchedContent = null;
        
        switch (type) {
          case 'banner':
            fetchedContent = await cmsService.getBanner(identifier);
            break;
          case 'navImages':
            fetchedContent = await cmsService.getNavigationImages(identifier);
            break;
          case 'productRelationships':
            // For this type, identifier should be an object with productId and relationType
            if (identifier && identifier.productId && identifier.relationType) {
              fetchedContent = await cmsService.getProductRelationships(
                identifier.productId, 
                identifier.relationType
              );
            } else {
              throw new Error('productId and relationType are required for productRelationships');
            }
            break;
          case 'homepage':
            fetchedContent = await cmsService.getHomepageContent();
            break;
          default:
            throw new Error(`Unsupported content type: ${type}`);
        }
        
        setContent(fetchedContent);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${type} content:`, err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, identifier]);

  // Show loading state
  if (loading) {
    if (renderLoading) {
      return renderLoading();
    }
    return fallback || <div className="animate-pulse bg-gray-200 h-20"></div>;
  }

  // Show error state
  if (error) {
    if (renderError) {
      return renderError(error);
    }
    return fallback || null;
  }

  // No content fetched
  if (!content) {
    return fallback || null;
  }

  // Use custom render function if provided
  if (render) {
    return render(content);
  }

  // Default rendering based on content type
  switch (type) {
    case 'banner':
      return (
        <div 
          className="relative w-full h-60 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
              {content.description && <p>{content.description}</p>}
              {content.buttonText && (
                <a 
                  href={content.buttonLink || "#"}
                  className="inline-block mt-4 px-6 py-2 bg-white text-black hover:bg-gray-100"
                >
                  {content.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      );
      
    case 'navImages':
      return (
        <div className="grid grid-cols-2 gap-4">
          {content.map(image => (
            <a key={image._id} href={image.link || "#"} className="block">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={image.imageUrl} 
                  alt={image.altText || image.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-all">
                  <span className="text-white font-medium">{image.name}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      );
      
    case 'productRelationships':
      return (
        <div className="grid grid-cols-2  md:grid-cols-4 gap-4">
          {content.map(product => (
            <a key={product.id} href={`/product/${product.id}`} className="block group">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img 
                  src={product.images?.[0] || product.image || "/images/placeholder.jpg"} 
                  alt={product.title || product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="mt-2 text-sm font-medium">{product.title || product.name}</h3>
              <p className="text-sm">₦{parseFloat(product.price).toLocaleString()}</p>
            </a>
          ))}
        </div>
      );
      
    case 'homepage':
      return (
        <div>
          {content.sections && content.sections.map((section, index) => (
            <div key={index} className="py-8">
              <h2 className="text-center text-2xl mb-4">{section.sectionId?.content?.title || ''}</h2>
              <p className="text-center">{section.sectionId?.content?.description || ''}</p>
            </div>
          ))}
        </div>
      );
      
    default:
      return fallback || <div>Content loaded but no default renderer available</div>;
  }
};

CMSContent.propTypes = {
  type: PropTypes.oneOf(['banner', 'navImages', 'productRelationships', 'homepage']).isRequired,
  identifier: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object // For productRelationships type
  ]).isRequired,
  fallback: PropTypes.node,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func,
  render: PropTypes.func
};

export default CMSContent;