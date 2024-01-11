import React from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Home</h1>

      {user && <p>{user.username} is logged in</p>}
    </div>
  );
};

export default Home;
