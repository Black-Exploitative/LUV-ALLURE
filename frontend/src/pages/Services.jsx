import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    src: "https://plus.unsplash.com/premium_photo-1661578500173-608987c20fc8?w=500&auto=format&fit=crop&q=60",
    title: "EXCLUSIVE PERSONAL SHOPPING",
    description:
      "Looking for something special that's not in our collection? Share your vision, and we'll find it or curate a perfect alternative just for you.",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=60",
    title: "SIGNATURE STYLING SERVICE",
    description:
      "From birthdays to galas, our expert stylists create personalized looks tailored to your unique style and any occasion.",
  },
  {
    id: 3,
    src: "https://plus.unsplash.com/premium_photo-1664530452424-2bc239d787d8?w=500&auto=format&fit=crop&q=60",
    title: "PERFECT FIT TAILORING",
    description:
      "Ensure every piece fits perfectly. Our tailoring service adjusts garments from our collection to match your exact measurements.",
  },
];

const Services = () => {
  return (
    <div className="bg-white min-h-screen px-6 py-16 sm:px-12 md:px-20 lg:px-32 font-sans">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif uppercase tracking-wide text-gray-900">
          Our Services
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
          Discover the exclusive experiences we offer to elevate your luxury lifestyle.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-shadow duration-500"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-t-3xl">
              <img
                src={service.src}
                alt={service.title}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="p-6">
              <h3 className="text-xl font-semibold font-serif text-gray-900 group-hover:text-black transition-colors duration-300 uppercase">
                {service.title}
              </h3>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
