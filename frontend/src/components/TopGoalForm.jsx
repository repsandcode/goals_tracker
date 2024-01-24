import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DateInput from "./DateInput";

const compareDates = (startDate, endDate) => {
  // Convert date strings to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get the time in milliseconds using .getTime()
  const startTime = start.getTime();
  const endTime = end.getTime();

  let errorMsg = {
    start: "",
    end: "",
  };

  // Compare the two dates
  if (startTime > endTime) {
    errorMsg.start = `Must be before end date.`;
    errorMsg.end = `Must be after start date.`;
  } else if (startTime === endTime) {
    errorMsg.start = `Dates must be different.`;
    errorMsg.end = `Dates must be different.`;
  }

  return errorMsg;
};

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

  const cleanDateErrorMsgs = () => {
    setErrorMsgs((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
  };

  const onChangeTopGoal = (val) => {
    setTopGoal(val);
    console.log(topGoal);

    setErrorMsgs((prev) => ({
      ...prev,
      topGoal: val === "" ? "Input your desired goal" : "",
    }));
  };

  const onChangeStartDate = (val) => {
    cleanDateErrorMsgs();

    setStartDate(val);

    if (endDate) {
      const errorMsg = compareDates(val, endDate);
      setErrorMsgs((prev) => ({
        ...prev,
        startDate: errorMsg.start,
        // endDate: errorMsg.end,
      }));
    }
  };

  const onChangeEndDate = (val) => {
    cleanDateErrorMsgs();

    setEndDate(val);

    if (startDate) {
      const errorMsg = compareDates(startDate, val);
      setErrorMsgs((prev) => ({
        ...prev,
        // startDate: errorMsg.start,
        endDate: errorMsg.end,
      }));
    }
  };

  const handleAddTopGoal = async (e) => {
    e.preventDefault();

    if (!topGoal || !startDate || !endDate) {
      setErrorMsgs({
        topGoal: !topGoal && "Input your top goal",
        startDate: !startDate && "Input your start date",
        endDate: !endDate && "Input your end date",
      });
      return; // Return early if there are errors
    }

    if (errorMsgs.topGoal || errorMsgs.startDate || errorMsgs.endDate) {
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
      <div className="mt-8">
        <label
          htmlFor="topGoal"
          className="block mb-2 text-sm font-medium text-black"
        >
          Top Goal
        </label>
        <div className="relative">
          <input
            type="text"
            name="topGoal"
            id="topGoal"
            className="sm:text-sm rounded-lg block w-full p-2.5 outline-none border"
            placeholder="Create a micro-SAAS product"
            value={topGoal}
            onChange={(e) => onChangeTopGoal(e.target.value)}
          />
          {errorMsgs.topGoal && (
            <span className="absolute text-rose-500 text-sm">
              {errorMsgs.topGoal}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-y-8 sm:gap-5 mt-8">
        <DateInput
          name={"start_date"}
          label={"Start Date"}
          value={startDate}
          onChange={onChangeStartDate}
          errorMsg={errorMsgs.startDate}
        />

        <DateInput
          name={"end_date"}
          label={"End Date"}
          value={endDate}
          onChange={onChangeEndDate}
          errorMsg={errorMsgs.endDate}
        />
      </div>

      {/* if there is a button in form, it will close the modal */}
      <div className="modal-action mt-8">
        <button type="submit" className="btn bg-green-400">
          {loading ? "Adding..." : "Add Top Goal"}
        </button>
      </div>
    </form>
  );
};
export default TopGoalForm;
