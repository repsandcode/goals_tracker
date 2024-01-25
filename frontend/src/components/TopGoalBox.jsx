import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const getRemainingDays = (endDate) => {
  const deadline = new Date(endDate); // Replace with your end date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = deadline - currentDate;

  // Convert milliseconds to days
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
};

const TopGoalBox = ({ goal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const goalName = goal.name;

  const handleTopGoalClick = (name) => {
    const username = user.username;
    const hyphenedName = name.split(" ").join("-");
    console.log(username);
    console.log(hyphenedName);
    navigate(`/${username}/top/${hyphenedName}`);
  };

  return (
    <div
      className="bg-slate-100 p-4 rounded-xl"
      onClick={() => handleTopGoalClick(goal.name)}
    >
      <p className="text-xl">
        {goalName.charAt(0).toUpperCase() + goalName.slice(1)}
      </p>

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
        {getRemainingDays(goal.end_date)} days left until End Date
      </div>
    </div>
  );
};

export default TopGoalBox;
