export default function OfferSection() {
  return (
    <>
      <section className="py-16 mt-[90px]">
        {/* Section Heading */}
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-[103px]">
            HERE’S WHAT THE SEASON OFFERS
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {/* Card 1 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo4.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-3">
              Crimson Allure
            </h3>
          </div>

          {/* Card 2 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo5.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-3">
              L’dact Allure
            </h3>
          </div>

          {/* Card 3 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/photo6.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-3">
              Novo Amor Allure
            </h3>
          </div>

          {/* Card 4 */}
          <div className="w-[280px] h-auto rounded-none overflow-hidden">
            <img
              src="/images/man-wearing-blank-shirt.jpg"
              alt="Product"
              className="w-full h-80 object-cover"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-3">
              Swivel Allure
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 max-w-7xl mx-auto mt-[162px]">
          {/* Rectangle 1 */}
          <div className="h-[800px]  flex items-center justify-center">
            <img
              src="/images/photo1.jpg"
              alt="Rectangle 1"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Rectangle 2 */}
          <div className="h-[800px] flex items-center justify-center">
            <img
              src="/images/photo2.jpg"
              alt="Rectangle 2"
              className="w-full  h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="relative w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/photo3.jpg"
            alt="Fashion Model"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black opacity-40"></div>
 
        <div className="absolute inset-0 flex flex-col justify-end items-center z-10">
          <div className="mb-8">
            <a
              href="#shop-now"
              className="inline-block px-8 py-3 border-2 border-white text-white text-lg"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
