import PropTypes from "prop-types";

const StatCard = ({ title, value, icon, change, changeType = "increase" }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg text-gray-500">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span
            className={`mr-1 ${
              changeType === "increase" ? "text-green-500" : "text-red-500"
            }`}
          >
            {changeType === "increase" ? "↑" : "↓"} {change}
          </span>
          <span className="text-gray-500 text-sm">vs. last month</span>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeType: PropTypes.oneOf(["increase", "decrease"]),
};

export default StatCard;
