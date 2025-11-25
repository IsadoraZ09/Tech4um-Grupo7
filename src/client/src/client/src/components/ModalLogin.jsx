import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";

export default function ModalLogin() {
  const { isLoginOpen, closeLogin, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isLoginOpen) {
      setName("");
      setEmail("");
      setErrors({});
    }
  }, [isLoginOpen]);

  // close on Escape key for accessibility
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeLogin();
    }
    if (isLoginOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoginOpen, closeLogin]);

  if (!isLoginOpen) return null;

  function validate() {
    const out = {};
    if (!name || name.trim().length < 3) {
      out.name = "O nome precisa ter ao menos 3 caracteres.";
    }

    if (!email || email.trim().length === 0) {
      out.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@")) {
      out.email = "O e-mail deve conter um “@”.";
    } else {
      // simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) out.email = "Formato de e-mail inválido.";
    }

    return out;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      // simulate login success
      login({
        name: name.trim(),
        email: email.trim(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name.trim()
        )}&background=3189c7&color=fff`,
      });
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-label="Login"
      onMouseDown={(e) => {
        if (e.target.classList.contains("modal-overlay")) closeLogin();
      }}
    >
      <div
        className="modal-content"
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">Que bom ter você aqui!</h3>
        <p className="modal-sub">
          Para participar de um 4um é necessário fazer login.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="label">Nome</label>
          <input
            className={`input ${errors.name ? "input-error" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
          {errors.name && <div className="error-msg">{errors.name}</div>}

          <label className="label">E-mail</label>
          <input
            className={`input ${errors.email ? "input-error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          {errors.email && <div className="error-msg">{errors.email}</div>}

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
