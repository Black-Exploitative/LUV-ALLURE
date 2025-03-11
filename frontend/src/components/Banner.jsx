import PropTypes from "prop-types";

const Banner = ({ imageUrl, title, description }) => {
  return (
    <div
      className="relative w-full h-70 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
        {title && (
          <h1 className="text-white text-4xl font-bold mb-2">{title}</h1>
        )}
        {description && (
          <p className="text-white text-lg max-w-2xl">{description}</p>
        )}
      </div>
    </div>
  );
};

Banner.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Banner;
