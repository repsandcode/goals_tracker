import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoClose } from "react-icons/io5";
import { isValidEmailFormat } from "../utils/utils";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const onChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const closeErrorMessage = (errorMessage) => {
    setErrorMessages((prevErrorMessages) =>
      prevErrorMessages.filter((msg) => msg !== errorMessage)
    );
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!isValidEmailFormat(email)) {
      setErrorMessages((prev) => [...prev, "Invalid email format"]);
      setEmail("");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessages((prev) => [...prev, "Passwords do not match"]);
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      });

      console.log(response);
      console.log(response.config.data);

      if (response.status === 200 || response.status === 201) {
        navigate("/");
      } else {
        setErrorMessages((prev) => [...prev, "Response error"]);
        resetForm();
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        // Extract and set error messages and keys from the backend response
        const errorData = error.response.data;

        Object.keys(errorData).forEach((key) => {
          if (key === "email") {
            setEmail("");
          }
          if (key === "username") {
            setUsername("");
          }

          setErrorMessages((prev) => [...prev, errorData[key]]);
        });
      } else {
        setErrorMessages((prev) => [
          ...prev,
          "An error occurred when creating your account",
        ]);
      }
    } finally {
      // Reset loading state after the request is complete
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-slate-100 p-12">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl mb-8">
          Create an account
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
          {/* FULL NAME */}
          <div className="flex justify-between gap-x-3">
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-black"
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
                placeholder="Fiorella"
                value={firstName}
                onChange={onChangeFirstName}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
                placeholder="Flores"
                value={lastName}
                onChange={onChangeLastName}
                required
              />
            </div>
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? "Creating your account..." : "Create account"}
          </button>

          <div className="fixed top-0 right-5 z-50" id="errorMessage">
            {errorMessages &&
              errorMessages.map((errorMessage) => (
                <div
                  className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 flex items-center justify-between mb-2"
                  role="alert"
                  key={errorMessage}
                >
                  <span>{errorMessage}</span>
                  <button
                    onClick={() => closeErrorMessage(errorMessage)}
                    className="ml-2 focus:outline-none "
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
          </div>

          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
            Already have an account?
            <a
              className="font-medium text-green-600 hover:underline dark:text-green-500 cursor-pointer ms-1"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
