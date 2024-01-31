import axios from "axios";
import React from "react";

const DailyGoalForm = () => {
  const handleAddDailyGoal = async () => {
    const response = await axios.post();
    return 0;
  };
  return (
    <form onSubmit={handleAddDailyGoal}>
      <div className="flex gap-x-1">
        <input
          type="text"
          className="sm:text-sm rounded-lg w-80 lg:w-9/12 p-2.5 outline-none"
        />
        <button
          type="submit"
          className="sm:text-sm rounded-lg w-20 lg:w-3/12 bg-green-400 p-2.5 outline-none"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default DailyGoalForm;
