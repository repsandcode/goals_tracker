import React from "react";

const DailyGoalBox = ({ goal }) => {
  return (
    <div className="mt-4 border rounded-2xl">
      <h3>{goal.name}</h3>
      <div>
        <span>{goal.start_time}</span>
        <span></span>
        <span>{goal.end_time}</span>
      </div>
      {/* <section>
        {Object.keys(goal).map((key, i) => (
          <p key={key}>
            {key}: {goal[key]}
          </p>
        ))}
      </section> */}
    </div>
  );
};

export default DailyGoalBox;
