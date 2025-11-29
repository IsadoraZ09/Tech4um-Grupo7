import React from "react";
import { createRoot } from "react-dom/client";
import App from "./screens/App.jsx";
import Forum from "./screens/Forum.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./styles/global.css"; // Mudança: usar global.css
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sala/:salaId" element={<Forum />} />
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
