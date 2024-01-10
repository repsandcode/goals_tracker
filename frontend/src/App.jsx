import { useState, useEffect } from "react";
import { Home, Login } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
