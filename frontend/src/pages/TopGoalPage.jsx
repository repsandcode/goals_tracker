import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components";
import DailyGoals from "../containers/DailyGoals";
import TopGoalHero from "../containers/TopGoalHero";

const TopGoalPage = () => {
  const { username, name } = useParams();
  const [topGoal, setTopGoal] = useState({});

  useEffect(() => {
    getTopGoal();
  }, []);

  const getTopGoal = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/top/goal/?username=${username}&name=${name}`
      );
      console.log(response.data);
      setTopGoal(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <DailyGoals />

      <TopGoalHero topGoal={topGoal} />
    </div>
  );
};

export default TopGoalPage;
