export default function OfferSection() {
    return (
      <section className="py-16 bg-gray-100">
        {/* Section Heading */}
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Here is what we have to offer
          </h2>
        </div>
  
        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {/* Card 1 */}
          <div className="border border-gray-300 rounded-none overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="Product"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Crimson Allure
              </h3>
              <p className="text-gray-700 mt-2">$500</p>
            </div>
          </div>
  
          {/* Card 2 */}
          <div className="border border-gray-300 rounded-none overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="Product"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
              L’dact Allure
              </h3>
              <p className="text-gray-700 mt-2">$750</p>
            </div>
          </div>
  
          {/* Card 3 */}
          <div className="border border-gray-300 rounded-none overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="Product"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
              Novo Amor Allure
              </h3>
              <p className="text-gray-700 mt-2">$750</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-gray-300 rounded-none overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="Product"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">
              Swivel Allure
              </h3>
              <p className="text-gray-700 mt-2">$750</p>
            </div>
          </div>

        </div>
      </section>
    );
  }
  