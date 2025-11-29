import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { authAPI } from "../../services/api.js";
import logo from "../../assets/Vector.png";
import styles from "./Header.module.css";
import "../../styles/global.css";

export default function Header() {
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

  const getInitials = (username) => {
    if (!username) return "?";
    const parts = username.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.contentInner}>
        <Link to="/" className={styles.brand} style={{ textDecoration: 'none' }}>
          <img src={logo} alt="tech4um logo" className={styles.brandLogo} />
          <span className={styles.brandSub}>Seu fórum sobre tecnologia!</span>
        </Link>

        <div ref={menuRef} style={{ position: "relative" }}>
          {!user ? (
            <button
              className={styles.btnLoginHeader}
              onClick={openLogin}
              aria-label="Entrar"
            >
              Entrar
            </button>
          ) : (
            <>
              <button
                className={styles.userAvatarBtn}
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <div className={styles.userAvatar}>
                  {getInitials(user.username)}
                </div>
                <span className={styles.userName}>{user.username}</span>
                <svg
                  className={`${styles.dropdownArrow} ${menuOpen ? styles.open : ''}`}
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
                  className={styles.userDropdown}
                  role="menu"
                  aria-label="Menu do perfil"
                >
                  <div className={styles.dropdownHeader}>
                    <div className={`${styles.userAvatar} ${styles.large}`}>
                      {getInitials(user.username)}
                    </div>
                    <div className={styles.userInfo}>
                      <h3 className={styles.userDropdownName}>{user.username}</h3>
                      <p className={styles.userDropdownEmail}>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className={styles.dropdownDivider} />
                  
                  <ul className={styles.dropdownMenu}>
                    <li>
                      <Link
                        to="/profile"
                        className={styles.dropdownItem}
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
                        className={styles.dropdownItem}
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
                        className={styles.dropdownItem}
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
                    
                    <div className={styles.dropdownDivider} />
                    
                    <li>
                      <button
                        className={`${styles.dropdownItem} ${styles.logout}`}
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