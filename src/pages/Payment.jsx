import { useState } from 'react';

const Payment = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    country: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryMethod: '',
    // Add other fields as needed
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, deliveryMethod: e.target.value });
  };

  const handleContinue = () => {
    setActiveSection(activeSection + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Personal Information Section */}
        <div className={`border-b-2 pb-6 ${activeSection === 1 ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-semibold">1. Personal Information</h2>
          <form className="mt-4">
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
          <button
            className="mt-6 bg-black text-white px-6 py-2 rounded-md"
            onClick={handleContinue}
            disabled={!formData.firstName || !formData.lastName || !formData.contactNumber}
          >
            Continue to Shipping
          </button>
        </div>

        {/* Shipping Section */}
        <div className={`border-b-2 pb-6 ${activeSection === 2 ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-semibold">2. Shipping</h2>
          <div className="mt-4">
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="homeDelivery"
                  checked={formData.deliveryMethod === 'homeDelivery'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Home Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="collectInStore"
                  checked={formData.deliveryMethod === 'collectInStore'}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Collect In Store
              </label>
            </div>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Address Line 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button
            className="mt-6 bg-black text-white px-6 py-2 rounded-md"
            onClick={handleContinue}
            disabled={!formData.address || !formData.country || !formData.city || !formData.postalCode}
          >
            Continue to Packaging & Gifting
          </button>
        </div>

        {/* Packaging & Gifting Section */}
        <div className={`border-b-2 pb-6 ${activeSection === 3 ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-semibold">3. Packaging & Gifting</h2>
          {/* Add your forms or other content here */}
          <button
            className="mt-6 bg-black text-white px-6 py-2 rounded-md"
            onClick={handleContinue}
          >
            Continue to Payment
          </button>
        </div>

        {/* Payment Section */}
        <div className={`pb-6 ${activeSection === 4 ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-semibold">4. Payment</h2>
          {/* Add payment form or other content here */}
        </div>
      </div>
    </div>
  );
};

export default Payment;
