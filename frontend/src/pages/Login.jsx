import React from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  return (
    <div>
      <form onSubmit={login}>
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" placeholder="Enter password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
