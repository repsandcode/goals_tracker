import React from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <Header />

      {user && <p>{user.username} is logged in</p>}
    </div>
  );
};

export default HomePage;
