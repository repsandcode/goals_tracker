import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import axios from "axios";

const HomePage = () => {
  const { user, authTokens } = useAuth();
  const [topGoals, setTopGoals] = useState([]);

  useEffect(() => {
    getTopGoals();
  }, []);

  const getTopGoals = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/goals/top/", {
      headers: {
        Authorization: "Bearer " + String(authTokens.access), //the token is a variable which holds the token
      },
    });

    setTopGoals(response.data);
  };

  return (
    <div>
      <Header />

      {user && <p>{user.username} is logged in</p>}

      <ul>
        {topGoals.map((goal) => (
          <li key={goal.id}>{goal.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
