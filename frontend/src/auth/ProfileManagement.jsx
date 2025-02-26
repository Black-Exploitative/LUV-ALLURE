import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ProfileManagement = ({ user, setUser }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-light">PERSONAL DETAILS</h2>
      <p className="text-sm text-gray-600">Update your personal information.</p>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              FIRST NAME
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              LAST NAME
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            PHONE NUMBER
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={user.phoneNumber}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
          />
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            whileHover={{ backgroundColor: "#333" }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
          >
            SAVE CHANGES
          </motion.button>
        </div>
      </form>

      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-lg font-light mb-4">CHANGE PASSWORD</h3>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CURRENT PASSWORD
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              NEW PASSWORD
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>

          <div className="pt-4">
            <motion.button
              type="submit"
              whileHover={{ backgroundColor: "#333" }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
            >
              UPDATE PASSWORD
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileManagement.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};

export default ProfileManagement;
