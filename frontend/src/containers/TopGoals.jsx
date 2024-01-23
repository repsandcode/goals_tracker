import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { IoAdd } from "react-icons/io5";
import { TopGoalBox, TopGoalForm } from "../components";

const TopGoals = () => {
  const navigate = useNavigate();
  const { authTokens, logout, user } = useAuth();

  const [topGoals, setTopGoals] = useState([]);

  useEffect(() => {
    getTopGoals();
  }, [authTokens]);

  useEffect(() => {
    const addTopGoalDialog = document.getElementById("addTopGoal");

    const handleCloseDialog = (event) => {
      if (event.target === addTopGoalDialog) {
        console.log("closed");
        addTopGoalDialog.close();
      }
    };

    document.addEventListener("click", handleCloseDialog);

    return () => {
      document.removeEventListener("click", handleCloseDialog);
    };
  }, []);

  const openDialog = () => {
    document.getElementById("addTopGoal").showModal();
  };

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
            onClick={openDialog}
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
