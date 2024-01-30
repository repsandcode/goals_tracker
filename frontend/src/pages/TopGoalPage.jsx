import React, { useEffect, useState } from "react";
import { Header } from "../components";

import DailyGoals from "../containers/TopGoalPage/DailyGoals";
import TopGoalHero from "../containers/TopGoalPage/TopGoalHero";

const TopGoalPage = () => {
  return (
    <div className="flex">
      <DailyGoals />
      <TopGoalHero />
    </div>
  );
};

export default TopGoalPage;
