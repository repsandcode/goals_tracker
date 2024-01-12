import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const login = (data) => {
    try {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("JWT token error:", error);
    }
  };

  const logout = () => {
    // Set the user to null
    setAuthTokens(null);
    setUser(null);
    // Remove the JWT token from local storage
    localStorage.removeItem("authTokens");
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
