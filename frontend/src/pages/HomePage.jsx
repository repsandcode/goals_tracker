import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import axios from "axios";
import { IoAdd } from "react-icons/io5";

const HomePage = () => {
  const { user, authTokens } = useAuth();
  const [topGoals, setTopGoals] = useState([]);

  useEffect(() => {
    getTopGoals();
  }, []);

  const getRemainingDays = (endDate) => {
    const deadline = new Date(endDate); // Replace with your end date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = deadline - currentDate;

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysRemaining;
  };

  const getTopGoals = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/top-goals/", {
      headers: {
        Authorization: "Bearer " + String(authTokens.access), //the token is a variable which holds the token
      },
    });

    console.log(response.data);
    setTopGoals(response.data);
  };

  return (
    <div className="md:container md:mx-auto">
      <Header />

      <div className="py-4">{user && <p>{user.username} is logged in</p>}</div>

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
            <div key={goal.id} className="bg-slate-100 p-4 rounded-xl">
              <p className="text-xl">{goal.name}</p>

              <div className="flex gap-x-3 mb-2">
                <div>
                  <span className="text-xs">Start Date</span>
                  <p className="p-2 text-sm bg-slate-300 rounded-xl">
                    {goal.formatted_start_date}
                  </p>
                </div>

                <div>
                  <span className="text-xs">End Date</span>
                  <p className="p-2 text-sm bg-slate-300 rounded-xl">
                    {goal.formatted_end_date}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                {getRemainingDays(goal.end_date)} days left
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
