// frontend/src/components/OrderSummary.jsx
import PropTypes from 'prop-types';

const OrderSummary = ({ subtotal, shipping, tax, packaging, total, itemCount }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
      <h3 className="text-xl font-medium mb-6">Order Summary</h3>
      
      {/* Item count */}
      <div className="text-sm text-gray-600 mb-4">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
      </div>

      {/* Cost breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping > 0 ? `₦${shipping.toLocaleString()}` : 'Calculated at next step'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (5%)</span>
          <span>₦{tax.toLocaleString()}</span>
        </div>
        
        {packaging > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <span>₦{packaging.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Secure checkout message */}
      <div className="flex items-center justify-center text-xs text-gray-500 mt-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        Secure checkout
      </div>
      
      {/* Payment icons */}
      <div className="flex justify-center space-x-2 mt-3">
        <img src="/icons/visa.svg" alt="Visa" className="h-6" />
        <img src="/icons/mastercard.svg" alt="Mastercard" className="h-6" />
        <img src="/icons/paystack.svg" alt="Paystack" className="h-6" />
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number,
  tax: PropTypes.number.isRequired,
  packaging: PropTypes.number,
  total: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired
};

OrderSummary.defaultProps = {
  shipping: 0,
  packaging: 0
};

export default OrderSummary;