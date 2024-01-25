import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components";
import DailyGoals from "../containers/DailyGoals";

const TopGoalPage = () => {
  const { username, name } = useParams();
  const [topGoal, setTopGoal] = useState({});

  useEffect(() => {
    getTopGoal();
  }, []);

  const getTopGoal = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/top-goals/get_top_goal/?username=${username}&name=${name}`
      );
      console.log(response);
      setTopGoal(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      console.log(topGoal);
    }
  };

  return (
    <div>
      <DailyGoals />
      {Object.keys(topGoal).map((key, i) => (
        <p key={key}>
          {key}: {topGoal[key]}
        </p>
      ))}
    </div>
  );
};

export default TopGoalPage;
