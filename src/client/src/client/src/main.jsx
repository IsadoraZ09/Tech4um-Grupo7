import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Sala_forum from "./Sala_forum.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sala/:salaId" element={<Sala_forum />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
