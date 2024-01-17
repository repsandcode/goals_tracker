import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IoAdd } from "react-icons/io5";
import TopGoalBox from "../components/TopGoalBox";

const TopGoals = () => {
  const { authTokens, logout } = useAuth();
  const [topGoals, setTopGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopGoals();
  }, []);

  const getTopGoals = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/top-goals/", {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      const data = response.data;

      if (response.status === 200) {
        setTopGoals(data);
      } else {
        // Handle other success status codes here if needed
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      // Handle errors, including 401 Unauthorized
      // console.error("Error fetching top goals:", error);
      if (error.response && error.response.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  return (
    <div>
      {/* TOP GOALS section */}
      <section className="my-6">
        <div className="mb-2 flex justify-between items-center font-light">
          <h2 className="text-2xl">Top Goals ({topGoals.length})</h2>

          <button className="flex items-center rounded-2xl py-3 px-4 border">
            <IoAdd />
            <span className="ml-1">Add</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topGoals.map((goal) => (
            <TopGoalBox key={goal.id} goal={goal} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TopGoals;
