import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ firstName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Check if firstName is defined before using slice
  const name = firstName
    ? `${firstName.slice(0, 1).toUpperCase()}${firstName.slice(1)}`
    : "";

  return (
    <div className="">
      <h1 className="text-2xl tracking-wide">Hello, {name}</h1>
      <p>Track your progress. You got this! 💪</p>

      <button
        className="cursor-pointer hover:text-green-500 hover:underline"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Header;
