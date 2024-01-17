import React from "react";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import TopGoals from "../containers/TopGoals";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="md:container md:mx-auto">
      <Header />

      <div className="py-4">{user && <p>{user.username} is logged in</p>}</div>

      <TopGoals />
    </div>
  );
};

export default HomePage;
