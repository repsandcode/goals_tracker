import React from "react";

const DateInput = ({ name, label, value, onChange, errorMsg }) => {
  return (
    <div className="grow">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-black"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type="date"
          name={name}
          id={name}
          className="sm:text-sm rounded-lg block w-full p-2.5 outline-none border"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {errorMsg && (
          <span className="absolute text-rose-500 text-sm">{errorMsg}</span>
        )}
      </div>
    </div>
  );
};

export default DateInput;
