import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IoAdd } from "react-icons/io5";
import TopGoalBox from "../components/TopGoalBox";

const TopGoalForm = ({ authTokens }) => {
  const [topGoal, setTopGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState({
    topGoal: "",
    startDate: "",
    endDate: "",
  });

  const onChangeTopGoal = (e) => setTopGoal(e.target.value);
  const onChangeStartDate = (e) => setStartDate(e.target.value);
  const onChangeEndDate = (e) => setEndDate(e.target.value);

  const handleAddTopGoal = async (e) => {
    e.preventDefault();

    if (topGoal === "") {
      setErrorMsgs((prev) => ({
        ...prev,
        topGoal: "Input your desired goal",
      }));
    }

    if (startDate === "") {
      setErrorMsgs((prev) => ({
        ...prev,
        startDate: "Enter a start date",
      }));
    }

    if (endDate === "") {
      setErrorMsgs((prev) => ({
        ...prev,
        endDate: "Enter an end date",
      }));
    }

    if (errorMsgs.topGoal || errorMsgs.startDate || errorMsgs.endDate) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/top-goals/",
        {
          name: topGoal,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`, // Include your authentication token here
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      console.log(response.data);
    } catch (error) {
      console.error("Login failed:", error.message);
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
            htmlFor="startDate"
            className="block mb-2 text-sm font-medium text-black"
          >
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
            value={startDate}
            onChange={onChangeStartDate}
          />
        </div>

        <div className="grow">
          <label
            htmlFor="endDate"
            className="block mb-2 text-sm font-medium text-black"
          >
            End Date
          </label>
          <input
            type="date"
            name="endData"
            id="endDate"
            className="sm:text-sm rounded-lg block w-full p-2.5 outline-none"
            value={endDate}
            onChange={onChangeEndDate}
          />
        </div>
      </div>

      {/* if there is a button in form, it will close the modal */}
      <div className="modal-action">
        <button className="btn bg-red-400">Close</button>
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
  }, []);

  const getTopGoals = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/top-goals/", {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      const data = response.data;

      if (response.status === 200) {
        setTopGoals(data);
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
              <TopGoalForm authTokens={authTokens} />
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
