import React from "react";
import logo from "../assets/logo_tech4um.png";

export default function Header() {
  return (
    <header className="header">
      <div className="content-inner">
        <div className="brand">
          <img src={logo} alt="tech4um logo" className="brand-logo" />
          <span className="brand-sub">Seu fórum sobre tecnologia!</span>
        </div>
        <div className="avatar" aria-label="Perfil"></div>
      </div>
    </header>
  );
}
