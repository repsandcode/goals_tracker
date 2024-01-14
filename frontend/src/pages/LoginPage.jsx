import React, { useState, useRef } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, authTokens } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    console.log(username);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        login(data);
        navigate("/");
      } else {
        setErrorMessage("Response error");
      }
    } catch (error) {
      setErrorMessage("An error occurred during Login");
      console.error("Login failed:", error);
    } finally {
      // Reset loading state after the request is complete
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-slate-100 p-12 w-96">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl mb-8">
          Login to your account
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-black"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
              placeholder="fiorella"
              value={username}
              onChange={onChangeUsername}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
              value={password}
              onChange={onChangePassword}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {errorMessage && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
            Don't have an account yet?
            <a
              className="font-medium text-green-600 hover:underline dark:text-green-500 cursor-pointer ms-1"
              onClick={() => navigate("/register")}
            >
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
