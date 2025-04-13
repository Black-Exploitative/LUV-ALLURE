import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';

const DatePicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const dropdownRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [internalValue, setInternalValue] = useState(value);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [activeSelector, setActiveSelector] = useState("month"); 
  
  // Generate arrays for days and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  // Determine the number of days in the selected month
  const getDaysInMonth = (month, year) => {
    // Month is 0-indexed in JavaScript Date
    const monthIndex = months.indexOf(month);
    return month ? new Date(year || currentYear, monthIndex + 1, 0).getDate() : 31;
  };
  
  const validDays = selectedMonth ? 
    Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1) : 
    days;

  // Format the date for display - only runs when value prop changes from outside
  useEffect(() => {
    if (value && value !== internalValue) {
      setInternalValue(value);
      const date = new Date(value);
      setSelectedYear(date.getFullYear().toString());
      setSelectedMonth(months[date.getMonth()]);
      setSelectedDay(date.getDate().toString());
      
      setDisplayValue(`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
    }
  }, [value, months, internalValue]);
  
  // Update the date when selections change - but only if all are selected and not on initial load
  useEffect(() => {
    if (selectedMonth && selectedDay && selectedYear && !isInitialLoad) {
      const monthIndex = months.indexOf(selectedMonth);
      const newDate = new Date(parseInt(selectedYear), monthIndex, parseInt(selectedDay));
      
      // Format as "YYYY-MM-DD" for the input value
      const formattedDate = newDate.toISOString().split('T')[0];
      
      // Only update if the date actually changed to prevent loops
      if (formattedDate !== internalValue) {
        setInternalValue(formattedDate);
        onChange({ target: { name: 'dateOfBirth', value: formattedDate } });
        
        // Format for display
        setDisplayValue(`${selectedMonth} ${selectedDay}, ${selectedYear}`);
      }
    }
    
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [selectedMonth, selectedDay, selectedYear, onChange, isInitialLoad, months, internalValue]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15
      }
    }
  };
  
  const itemVariants = {
    hover: { 
      backgroundColor: "rgba(0,0,0,0.05)",
      color: "#000000",
      transition: { duration: 0.2 }
    }
  };
  
  const selectorVariants = {
    inactive: { opacity: 0.6, x: 0 },
    active: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`appearance-none cursor-pointer flex items-center justify-between w-full px-3 py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || "Select date of birth"}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-sm"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Selector tabs */}
            <div className="flex border-b border-gray-100">
              <motion.div 
                className={`flex-1 py-2 text-center cursor-pointer text-xs ${activeSelector === 'month' ? 'font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveSelector('month')}
                variants={selectorVariants}
                animate={activeSelector === 'month' ? 'active' : 'inactive'}
              >
                MONTH
                {activeSelector === 'month' && (
                  <motion.div className="h-px bg-black w-full mt-1" layoutId="activeDateSelector" />
                )}
              </motion.div>
              <motion.div 
                className={`flex-1 py-2 text-center cursor-pointer text-xs ${activeSelector === 'day' ? 'font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveSelector('day')}
                variants={selectorVariants}
                animate={activeSelector === 'day' ? 'active' : 'inactive'}
              >
                DAY
                {activeSelector === 'day' && (
                  <motion.div className="h-px bg-black w-full mt-1" layoutId="activeDateSelector" />
                )}
              </motion.div>
              <motion.div 
                className={`flex-1 py-2 text-center cursor-pointer text-xs ${activeSelector === 'year' ? 'font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveSelector('year')}
                variants={selectorVariants}
                animate={activeSelector === 'year' ? 'active' : 'inactive'}
              >
                YEAR
                {activeSelector === 'year' && (
                  <motion.div className="h-px bg-black w-full mt-1" layoutId="activeDateSelector" />
                )}
              </motion.div>
            </div>
            
            {/* Selection panel */}
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              {activeSelector === 'month' && (
                <div className="grid grid-cols-2 gap-1 p-2">
                  {months.map((month) => (
                    <motion.div
                      key={month}
                      className={`px-3 py-2 text-sm cursor-pointer rounded ${
                        selectedMonth === month ? 'bg-black text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedMonth(month);
                        setActiveSelector('day');
                      }}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      {month}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {activeSelector === 'day' && (
                <div className="grid grid-cols-5 gap-1 p-2">
                  {validDays.map((day) => (
                    <motion.div
                      key={day}
                      className={`px-3 py-2 text-sm cursor-pointer text-center rounded ${
                        selectedDay === day.toString() ? 'bg-black text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedDay(day.toString());
                        setActiveSelector('year');
                      }}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      {day}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {activeSelector === 'year' && (
                <div className="grid grid-cols-4 gap-1 p-2">
                  {years.map((year) => (
                    <motion.div
                      key={year}
                      className={`px-3 py-2 text-sm cursor-pointer text-center rounded ${
                        selectedYear === year.toString() ? 'bg-black text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedYear(year.toString());
                        setIsOpen(false);
                      }}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      {year}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden actual input to maintain form compatibility */}
      <input
        type="date"
        name="dateOfBirth"
        value={internalValue || ''}
        onChange={() => {}}
        className="hidden"
      />
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default DatePicker;