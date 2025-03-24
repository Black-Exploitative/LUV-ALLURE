import { useState } from "react";
import countryCodes from "./countryCodes"; 

export default function CountryCodeInput({ value, onChange }) {
  const [countryCode, setCountryCode] = useState("+234"); 

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="p-2 bg-gray-100 border-r border-gray-300 text-sm"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.dial_code}>
            {country.dial_code} ({country.name})
          </option>
        ))}
      </select>

      <input
        type="tel"
        value={value}
        onChange={onChange}
        className="w-full p-2 text-sm outline-none"
        placeholder="Enter your number"
      />
    </div>
  );
}
