import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Orders = ({ orders }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium mb-4">ORDER HISTORY</h2>
      <p className="text-xs text-gray-800 font-base font-[Raleway] mb-6">View and track all your orders.</p>

      {orders.length > 0 ? (
        <div className="border border-gray-200">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`p-6 ${
                index !== orders.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-3 py-1 text-xs bg-green-50 text-green-800">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">Items:</p>
                <ul className="ml-4 list-disc font-normal font-[Raleway]">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.quantity} - {item.price}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">Total: {order.total}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs underline"
                >
                  VIEW ORDER DETAILS
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs underline"
                >
                  TRACK PACKAGE
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-4">
            You have not placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white text-sm"
          >
            EXPLORE COLLECTIONS
          </Link>
        </div>
      )}
    </div>
  );
};

Orders.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        })
      ).isRequired,
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default Orders;
