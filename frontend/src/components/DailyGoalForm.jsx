import axios from "axios";
import React from "react";

const DailyGoalForm = () => {
  const handleAddDailyGoal = async () => {
    const response = await axios.post();
    return 0;
  };

  return (
    <form onSubmit={handleAddDailyGoal}>
      <div className="flex lg:flex-col gap-x-1">
        <input
          type="text"
          className="sm:text-sm rounded-lg w-80 lg:w-full p-2.5 outline-none dark:text-slate-700"
        />

        <div className="w-full gap-2">
          <input
            type="time"
            className="sm:text-sm p-2.5 rounded-lg dark:text-slate-700"
          />
          <span></span>
          <input
            type="time"
            className="sm:text-sm p-2.5 rounded-lg dark:text-slate-700"
          />
        </div>

        <button
          type="submit"
          className="sm:text-sm rounded-lg w-20 lg:w-full bg-green-400 p-2.5 outline-none dark:text-slate-700"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default DailyGoalForm;
