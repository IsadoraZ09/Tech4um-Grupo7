import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { authAPI } from "../services/api";
import logo from "../assets/Vector.png";

export default function Header_login() {
  const { user, openLogin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      logout();
      setMenuOpen(false);
      navigate("/");
    }
  };

  // Gerar iniciais do username
  const getInitials = (username) => {
    if (!username) return "?";
    const parts = username.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header">
      <div className="content-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="tech4um logo" className="brand-logo" />
          <span className="brand-sub">Seu fórum sobre tecnologia!</span>
        </Link>

        <div ref={menuRef} style={{ position: "relative" }}>
          {!user ? (
            <button
              className="btn-login-orange"
              onClick={openLogin}
              aria-label="Entrar"
              title="Entrar"
            >
              <span className="sr-only">Entrar</span>
            </button>
          ) : (
            <>
              <button
                className="user-avatar-btn"
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <div className="user-avatar">
                  {getInitials(user.username)}
                </div>
                <span className="user-name">{user.username}</span>
                <svg
                  className={`dropdown-arrow ${menuOpen ? 'open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div
                  className="user-dropdown"
                  role="menu"
                  aria-label="Menu do perfil"
                >
                  <div className="dropdown-header">
                    <div className="user-avatar large">
                      {getInitials(user.username)}
                    </div>
                    <div className="user-info">
                      <h3 className="user-dropdown-name">{user.username}</h3>
                      <p className="user-dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider" />
                  
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Meu Perfil
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-forums"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Meus 4ums
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Configurações
                      </Link>
                    </li>
                    
                    <div className="dropdown-divider" />
                    
                    <li>
                      <button
                        className="dropdown-item logout"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Sair
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
