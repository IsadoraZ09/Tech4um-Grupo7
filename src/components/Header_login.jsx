import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo_tech4um.png";
import { useAuth } from "../AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const shown = user || {
    name: "Usuário",
    email: "email@exemplo.com",
    avatar:
      "https://ui-avatars.com/api/?name=Usuário&background=eb520e&color=fff",
  };

  return (
    <header className="header header-login">
      <div className="content-inner content-inner-login">
        <div className="brand">
          <img src={logo} alt="tech4um logo" className="brand-logo" />
          <span className="brand-sub">Seu fórum sobre tecnologia!</span>
        </div>
        <div
          className="user-info-login"
          ref={menuRef}
          style={{ position: "relative" }}
        >
          <div className="user-details-login">
            <span className="user-name-login">{shown.name}</span>
            <span className="user-email-login">{shown.email}</span>
          </div>
          <img
            src={shown.avatar}
            alt="Avatar do usuário"
            className="avatar-login clickable-avatar"
            onClick={() => setMenuOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          />

          {menuOpen && (
            <div
              className="profile-menu profile-menu-login"
              role="menu"
              aria-label="Menu do perfil"
            >
              <div className="profile-menu-user">
                <div style={{ fontWeight: 700 }}>{shown.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {shown.email}
                </div>
              </div>
              <div style={{ height: 8 }} />
              <button
                className="profile-menu-item"
                role="menuitem"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
