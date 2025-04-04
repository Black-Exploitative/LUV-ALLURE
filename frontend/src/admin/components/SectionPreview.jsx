// frontend/src/admin/components/SectionPreview.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Component that renders a preview of different section types for the admin interface
 */
const SectionPreview = ({ section }) => {
  if (!section) return null;

  // Handle different section types
  switch (section.type) {
    case 'hero':
      return (
        <div className="relative w-full h-40 overflow-hidden border border-gray-300 rounded">
          {section.media?.imageUrl ? (
            <img 
              src={section.media.imageUrl} 
              alt={section.content?.title || 'Hero background'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No image set
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-4">
            {section.content?.title && (
              <h3 className="text-white text-lg font-medium text-center">{section.content.title}</h3>
            )}
            {section.content?.subtitle && (
              <p className="text-white text-xs mt-1 text-center">{section.content.subtitle}</p>
            )}
            {section.content?.buttonText && (
              <span className="mt-2 px-3 py-1 bg-white text-black text-xs inline-block">
                {section.content.buttonText}
              </span>
            )}
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className="relative w-full h-32 overflow-hidden border border-gray-300 rounded">
          {section.media?.imageUrl ? (
            <img 
              src={section.media.imageUrl} 
              alt={section.content?.title || 'Banner background'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No image set
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-4">
            {section.content?.title && (
              <h3 className="text-white text-md font-medium text-center">{section.content.title}</h3>
            )}
            {section.content?.description && (
              <p className="text-white text-xs mt-1 text-center line-clamp-2">{section.content.description}</p>
            )}
            {section.content?.buttonText && (
              <span className="mt-2 px-2 py-1 bg-white text-black text-xs inline-block">
                {section.content.buttonText}
              </span>
            )}
          </div>
        </div>
      );

    case 'featured-products':
      return (
        <div className="border border-gray-300 rounded p-3">
          <h3 className="text-sm font-medium text-center mb-2">
            {section.content?.title || 'Featured Products'}
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 w-full aspect-square"></div>
            ))}
          </div>
          {section.content?.description && (
            <p className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
              {section.content.description}
            </p>
          )}
        </div>
      );

    case 'collection':
      return (
        <div className="border border-gray-300 rounded p-3">
          <h3 className="text-sm font-medium text-center mb-2">
            {section.content?.title || 'Collection'}
          </h3>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 w-full aspect-square"></div>
            ))}
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="border border-gray-300 rounded p-3 text-center">
          <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full mb-2"></div>
          <h3 className="text-sm font-medium">
            {section.content?.title || 'Customer Testimonial'}
          </h3>
          <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
            {section.content?.description || "Customer review goes here..."}
          </p>
        </div>
      );

    case 'custom':
    default:
      return (
        <div className="border border-gray-300 rounded p-3">
          <h3 className="text-sm font-medium text-center">
            {section.content?.title || 'Custom Section'}
          </h3>
          {section.content?.description && (
            <p className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
              {section.content.description}
            </p>
          )}
          {section.media?.imageUrl && (
            <div className="mt-2 h-20 bg-gray-100">
              <img 
                src={section.media.imageUrl} 
                alt={section.content?.title || 'Section image'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      );
  }
};

SectionPreview.propTypes = {
  section: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      buttonText: PropTypes.string,
      buttonLink: PropTypes.string,
      alignment: PropTypes.string,
    }),
    media: PropTypes.shape({
      imageUrl: PropTypes.string,
      videoUrl: PropTypes.string,
      altText: PropTypes.string,
    }),
    products: PropTypes.array,
    isActive: PropTypes.bool,
    order: PropTypes.number,
  }),
};

export default SectionPreview;