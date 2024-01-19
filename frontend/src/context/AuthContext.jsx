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
    localStorage.getItem("authTokens") ? jwtDecode(authTokens.access) : null
  );
  const [loading, setLoading] = useState(true);

  const login = (data) => {
    try {
      setAuthTokens(data);

      const decodedUser = jwtDecode(data.access);

      setUser(decodedUser);

      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("JWT token error:", error);
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const updateToken = async () => {
    console.log("Updated Token!");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/refresh/",
        {
          refresh: authTokens?.refresh,
        }
      );

      const data = response.data;

      console.log(data);

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Updating token failed:", error.message);
    } finally {
      if (loading) {
        // Reset loading state after the request is complete
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (loading) {
      // Reset loading state after the request is complete
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      if (authTokens) {
        console.log("Update token called!");
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={{ user, authTokens, login, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

// Create a hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
