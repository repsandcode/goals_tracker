import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    console.log("form submitted");
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      username: e.target.username.value,
      password: e.target.password.value,
    });

    const data = response.data;

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
    }
    // Store the JWT token in local storage
    // localStorage.setItem("jwtToken", token);
    // // Decode and set the user based on the token (you may use a library like `jsonwebtoken`)
    // const decodedToken = /* your decoding logic */;
    // setUser(decodedToken);
  };

  const logout = () => {
    // Remove the JWT token from local storage
    localStorage.removeItem("jwtToken");
    // Set the user to null
    setUser(null);
  };

  // useEffect(() => {
  //   // Check if a valid JWT token is stored (you may need to adjust this logic)
  //   const storedToken = localStorage.getItem("jwtToken");

  //   if (storedToken) {
  //     // Decode and verify the token (you may use a library like `jsonwebtoken`)
  //     // Set the user based on the decoded token
  //     const decodedToken = /* your decoding logic */;
  //     setUser(decodedToken);
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
