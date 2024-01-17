import { useState, useEffect } from "react";
import { HomePage, LoginPage, RegisterPage } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoutes from "./utils/PrivateRoutes";
import "./App.css";

function App() {
  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<HomePage />} path="/" replace={true} />
            <Route element={<HomePage />} path="/:username" />
          </Route>

          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
