import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IoAdd } from "react-icons/io5";
import TopGoalBox from "../components/TopGoalBox";

const TopGoalForm = ({ access, getTopGoals }) => {
  const [topGoal, setTopGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState({
    topGoal: "",
    startDate: "",
    endDate: "",
  });

  const { authTokens } = useAuth();
  const [accessToken, setAccessToken] = useState(authTokens.access);

  useEffect(() => {
    // Update the access token whenever it changes
    setAccessToken(authTokens.access);
  }, [authTokens]);

  const onChangeTopGoal = (e) => setTopGoal(e.target.value);
  const onChangeStartDate = (e) => setStartDate(e.target.value);
  const onChangeEndDate = (e) => setEndDate(e.target.value);

  const handleAddTopGoal = async (e) => {
    e.preventDefault();
    const tokens = JSON.parse(localStorage.getItem("authTokens"));
    console.log("Both tokens in TopGoals.jsx -> ", access === accessToken);
    console.log(
      "Against localStorage access token? ",
      accessToken === tokens.access
    );
    console.log("Access Token:", accessToken); // Log access token

    if (topGoal === "" || startDate === "" || endDate === "") {
      setErrorMsgs({
        topGoal: topGoal === "" ? "Input your desired goal" : "",
        startDate: startDate === "" ? "Enter a start date" : "",
        endDate: endDate === "" ? "Enter an end date" : "",
      });

      return;
    }

    setLoading(true);

    try {
      const data = {
        name: topGoal,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/top-goals/",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);
      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        // Close the modal
        document.getElementById("addTopGoal").close();

        // Fetch the updated list of top goals and update the state
        getTopGoals();
      }
    } catch (error) {
      console.error("Error adding top goal:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="dialog" onSubmit={handleAddTopGoal}>
      <div className="mt-5">
        <label
          htmlFor="topGoal"
          className="block mb-2 text-sm font-medium text-black"
        >
          Top Goal
        </label>
        <input
          type="text"
          name="topGoal"
          id="topGoal"
          className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
          placeholder="Create a micro-SAAS product"
          value={topGoal}
          onChange={onChangeTopGoal}
        />
      </div>

      <div className="flex gap-x-2.5 mt-5">
        <div className="grow">
          <label
            htmlFor="start_date"
            className="block mb-2 text-sm font-medium text-black"
          >
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
            value={startDate}
            onChange={onChangeStartDate}
          />
        </div>

        <div className="grow">
          <label
            htmlFor="end_date"
            className="block mb-2 text-sm font-medium text-black"
          >
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
            value={endDate}
            onChange={onChangeEndDate}
          />
        </div>
      </div>

      {/* if there is a button in form, it will close the modal */}
      <div className="modal-action">
        <button type="submit" className="btn bg-green-400">
          {loading ? "Adding..." : "Add Top Goal"}
        </button>
      </div>
    </form>
  );
};

const TopGoals = () => {
  const navigate = useNavigate();
  const { authTokens, logout } = useAuth();

  const [topGoals, setTopGoals] = useState([]);

  useEffect(() => {
    getTopGoals();
  }, [authTokens]);

  const getTopGoals = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/top-goals/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      const data = response.data;

      if (response.status === 200) {
        setTopGoals(data);
        console.log("Access Token to get all ->", authTokens.access);
      } else {
        // Handle other success status codes here if needed
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      // Handle errors, including 401 Unauthorized
      // console.error("Error fetching top goals:", error);
      // if (error.response && error.response.status === 401) {
      //   logout();
      //   navigate("/login");
      // }
      console.log(error.message);
    }
  };

  return (
    <div>
      {/* TOP GOALS section */}
      <section className="my-6">
        <div className="mb-2 flex justify-between items-center font-light">
          <h2 className="text-2xl">Top Goals ({topGoals.length})</h2>

          <button
            className="flex items-center rounded-2xl py-3 px-4 border"
            id="addNewTopGoalButton"
            onClick={() => document.getElementById("addTopGoal").showModal()}
          >
            <IoAdd />
            <span className="ml-1">Add</span>
          </button>

          <dialog id="addTopGoal" className="modal modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                What's a top goal you want to achieve?
              </h3>
              <TopGoalForm
                access={authTokens.access}
                getTopGoals={getTopGoals}
              />
            </div>
          </dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topGoals.map((goal) => (
            <TopGoalBox key={goal.id} goal={goal} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TopGoals;
