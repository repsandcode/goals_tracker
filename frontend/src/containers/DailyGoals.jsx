import React, { useState } from "react";
import { DailyGoalForm } from "../components";
import axios from "axios";

const DailyGoals = () => {
  const [dailyGoals, setDailyGoals] = useState([]);

  const getDailyGoals = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/daily-goals/");
  };

  return (
    <div>
      <DailyGoalForm />
    </div>
  );
};

export default DailyGoals;
