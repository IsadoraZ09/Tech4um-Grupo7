import React from "react";
import { createRoot } from "react-dom/client";
import App from "./screens/App.jsx";
import Forum from "./screens/Forum.jsx";
import { AuthProvider } from "./features/AuthContext.jsx";
import "./styles/global.css"; // Mudança: usar global.css
import { BrowserRouter, Routes, Route } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sala/:salaId" element={<Forum />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
