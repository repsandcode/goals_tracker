import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between">
      <h1>Micro-SaaS #1</h1>

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
