import PropTypes from "prop-types";
import { useState } from "react";

const ExpandableSection = ({ title, content, isTable, tableData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border-b border-gray-300 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpansion}
      >
        <h3 className="text-[13px] font-normal text-black">{title}</h3>
        <span className="text-xl font-bold">
          {isExpanded ? "−" : "+"}
        </span>
      </div>
      {isExpanded && (
        <div className="mt-4 text-black text-[13px] font-normal">
          {isTable && tableData ? (
            <div className="divide-y">
              {tableData.map((row, index) => (
                <div key={index} className="flex py-2">
                  <div className="w-1/3 bg-gray-100 p-2 text-[10px] font-normal">{row.label}</div>
                  <div className="w-2/3 p-2">{row.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] font-normal text-gray-600">{content}</p>
          )}
        </div>
      )}
    </div>
  );
};

ExpandableSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  isTable: PropTypes.bool,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  )
};

ExpandableSection.defaultProps = {
  content: "",
  isTable: false,
  tableData: []
};

export default ExpandableSection;