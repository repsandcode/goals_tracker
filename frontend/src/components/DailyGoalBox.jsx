import React from "react";

const DailyGoalBox = ({ goal }) => {
  return (
    <div>
      <section>
        {Object.keys(goal).map((key, i) => (
          <p key={key}>
            {key}: {goal[key]}
          </p>
        ))}
      </section>
    </div>
  );
};

export default DailyGoalBox;
