import axios from "axios";
import React from "react";

const DailyGoalForm = () => {
  const handleAddDailyGoal = async () => {
    const response = await axios.post();
    return 0;
  };
  return (
    <form onSubmit={handleAddDailyGoal}>
      <input type="text" />
      <button type="submit">Add Daily Goal</button>
    </form>
  );
};

export default DailyGoalForm;
