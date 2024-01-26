import React from "react";

const TopGoalHero = ({ topGoal }) => {
  return (
    <section>
      {Object.keys(topGoal).map((key, i) => (
        <p key={key}>
          {key}: {topGoal[key]}
        </p>
      ))}
    </section>
  );
};

export default TopGoalHero;
