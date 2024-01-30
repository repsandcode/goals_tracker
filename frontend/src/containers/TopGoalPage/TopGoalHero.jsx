import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TopGoalHero = () => {
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
    <section className="w-full lg:w-2/3 border border-blue-400 rounded-2xl">
      {Object.keys(topGoal).map((key, i) => (
        <p key={key}>
          {key}: {topGoal[key]}
        </p>
      ))}
    </section>
  );
};

export default TopGoalHero;
