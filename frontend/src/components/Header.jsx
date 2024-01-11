import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  let { user } = useAuth();

  return (
    <div>
      <h1>Micro-SaaS #1</h1>
      {user ? <p>Logout</p> : <Link to="/login">Login</Link>}
      {user && <p>{user.username} is logged in</p>}
    </div>
  );
};

export default Header;
