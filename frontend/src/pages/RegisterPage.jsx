import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value);
    console.log(name);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    console.log(username);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    console.log(confirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post("/", {
        username: e.target.username.value,
        password: e.target.password.value,
      });

      console.log(response);
      const data = response.data;

      if (response.status === 200) {
        login(data);
        navigate("/");
      } else {
        setErrorMessage("Response error");
      }
    } catch (error) {
      setErrorMessage("An error occurred during Login");
      console.error("Login failed:", error.message);
    } finally {
      // Reset loading state after the request is complete
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-slate-100 p-12 w-96">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
          Create an account
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-black"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
              placeholder="Fiorella Flores"
              value={name}
              onChange={onChangeName}
            />
          </div>

          {/* Username */}
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
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
              placeholder="fiorellaflores@gmail.com"
              value={email}
              onChange={onChangeEmail}
            />
          </div>

          {/* Password */}
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
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? "Creating your account..." : "Create account"}
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
            Already have an account?
            <a
              className="font-medium text-green-600 hover:underline dark:text-green-500"
              onClick={() => navigate("/login")}
            >
              {" "}
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
