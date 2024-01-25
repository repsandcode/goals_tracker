import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import TopGoals from "../containers/TopGoals";

import axios from "axios";

const HomePage = () => {
  const { user, authTokens } = useAuth();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/users/${user && user.user_id}/`,
        {
          headers: {
            Authorization: "Bearer " + authTokens.access,
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setUserDetails(data);
      } else {
        // Handle other success status codes here if needed
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      // Handle errors, including 401 Unauthorized
      // console.error("Error fetching top goals:", error);
      console.log(error);
      // if (error.response && error.response.status === 401) {
      //   logout();
      //   navigate("/login");
      // }
    }
  };

  return (
    <div className="">
      <Header firstName={userDetails.first_name} />

      <TopGoals />
    </div>
  );
};

export default HomePage;
