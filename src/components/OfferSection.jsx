export default function OfferSection() {
  return (
    <section className="py-16 bg-gray-100">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          HERE’S WHAT THE SEASON OFFERS
        </h2>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {/* Card 1 */}
        <div className="w-[280px] h-auto rounded-none overflow-hidden">
          <img
            src="/images/man-wearing-blank-shirt.jpg"
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
            src="/images/man-wearing-blank-shirt.jpg"
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
            src="/images/man-wearing-blank-shirt.jpg"
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

          <h3 className="text-xl font-semibold text-gray-900 mt-3">Swivel Allure</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-0 max-w-7xl mx-auto mt-8">
        {/* Rectangle 1 */}
        <div className="h-[400px]  flex items-center justify-center">
          <img
            src="/images/man-wearing-blank-shirt.jpg"
            alt="Rectangle 1"
            className="max-h-full w-[800px]"
          />
        </div>

        {/* Rectangle 2 */}
        <div className="h-[400px] bg-gray-300 flex items-center justify-center">
          <img
            src="/images/man-wearing-blank-shirt.jpg"
            alt="Rectangle 2"
            className="max-h-full w-[800px]"
          />
        </div>
      </div>
    </section>
  );
}
