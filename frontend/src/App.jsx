import { useState, useEffect } from "react";
import { Home, Login } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoutes from "./utils/PrivateRoutes";
import "./App.css";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/" exact />
          </Route>

          <Route element={<Login />} path="/login" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
