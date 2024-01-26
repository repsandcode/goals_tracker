import React, { useState } from "react";
import { DailyGoalBox, DailyGoalForm } from "../components";
import axios from "axios";

const DailyGoals = () => {
  const [dailyGoals, setDailyGoals] = useState([]);

  const getDailyGoals = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/daily-goals/");
  };

  return (
    <section>
      <div>
        <DailyGoalForm />
      </div>
      <div>
        <DailyGoalBox />
      </div>
    </section>
  );
};

export default DailyGoals;
