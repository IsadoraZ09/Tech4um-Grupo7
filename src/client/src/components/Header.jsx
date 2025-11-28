import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/Vector.png";
import { useAuth } from "../AuthContext.jsx";

export default function Header() {
  const { user, openLogin, logout } = useAuth();
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

  return (
    <header className="header">
      <div className="content-inner">
        <div className="brand">
          <img src={logo} alt="tech4um logo" className="brand-logo" />
          <span className="brand-sub">Seu fórum sobre tecnologia!</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!user ? (
            <button
              className="btn-login-header"
              onClick={openLogin}
              aria-label="Entrar"
            >
              Entrar
            </button>
          ) : (
            <div
              ref={menuRef}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                position: "relative",
              }}
            >
              <div style={{ textAlign: "right", marginRight: 6 }}>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {user.email}
                </div>
              </div>
              <img
                src={user.avatar}
                alt="avatar"
                className="avatar clickable-avatar"
                style={{ width: 48, height: 48, cursor: "pointer" }}
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              />

              {menuOpen && (
                <div
                  className="profile-menu"
                  role="menu"
                  aria-label="Menu do perfil"
                >
                  <div className="profile-menu-user">
                    <div style={{ fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {user.email}
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
          )}
        </div>
      </div>
    </header>
  );
}
