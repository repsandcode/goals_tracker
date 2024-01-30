import React, { useEffect, useState } from "react";
import { DailyGoalBox, DailyGoalForm } from "../../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DailyGoals = () => {
  const { username, name } = useParams();
  const { authTokens } = useAuth();

  const [dailyGoals, setDailyGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDailyGoals();
  }, [username, name, authTokens]); // Run effect whenever username or name changes

  const getDailyGoals = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/daily/?top-goal=${name}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setDailyGoals(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log("Error fetching daily goals:", error);
      setError("Error fetching daily goals. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <section className="w-full lg:w-1/3 border border-red-400 rounded-2xl">
      <div>
        <DailyGoalForm />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          dailyGoals.map((goal) => <DailyGoalBox key={goal.id} goal={goal} />)
        )}
      </div>
    </section>
  );
};

export default DailyGoals;
