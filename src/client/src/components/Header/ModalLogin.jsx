import React, { useState, useEffect } from "react";
import { useAuth } from "../../features/AuthContext.jsx";
import { authAPI } from "../../services/api";
import styles from "./ModalLogin.module.css"; // Importação do CSS Modules
import "../../styles/global.css";

export default function ModalLogin() {
  const { isLoginOpen, closeLogin, login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isLoginOpen) {
      resetForm();
    }
  }, [isLoginOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeLogin();
    }
    if (isLoginOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoginOpen, closeLogin]);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setErrors({});
    setServerError("");
    setIsSignup(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setServerError("");
  };

  if (!isLoginOpen) return null;

  function validate() {
    const out = {};

    // Validação de username (apenas para cadastro)
    if (isSignup) {
      if (!username || username.trim().length < 3) {
        out.username = "O nome de usuário precisa ter ao menos 3 caracteres.";
      }
    }

    // Validação de email
    if (!email || email.trim().length === 0) {
      out.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@")) {
      out.email = 'O e-mail deve conter um "@".';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        out.email = "Formato de e-mail inválido.";
      }
    }

    // Validação de senha
    if (!password || password.length === 0) {
      out.password = "A senha é obrigatória.";
    } else if (isSignup && password.length < 8) {
      out.password = "A senha deve ter no mínimo 8 caracteres.";
    }

    // Validação de confirmação de senha (apenas para cadastro)
    if (isSignup) {
      if (!passwordConfirm) {
        out.passwordConfirm = "Confirme sua senha.";
      } else if (password !== passwordConfirm) {
        out.passwordConfirm = "As senhas não coincidem.";
      }
    }

    return out;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        if (isSignup) {
          // Cadastro
          const response = await authAPI.signup({
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password,
            passwordConfirm,
          });

          const { token, data } = response.data;
          localStorage.setItem("token", token);
          
          login({
            id: data.user._id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
          });
        } else {
          // Login
          const response = await authAPI.login({
            email: email.trim().toLowerCase(),
            password,
          });

          const { token, data } = response.data;
          localStorage.setItem("token", token);
          
          login({
            id: data.user._id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
          });
        }
      } catch (error) {
        console.error("Erro ao autenticar:", error);
        const message = error.response?.data?.message || 
                       (isSignup ? "Erro ao criar conta. Tente novamente." : "E-mail ou senha incorretos.");
        setServerError(message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-label={isSignup ? "Cadastro" : "Login"}
      onMouseDown={(e) => {
        if (e.target.classList.contains("modal-overlay")) closeLogin();
      }}
    >
      <div
        className={styles.modalContent}
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className={styles.modalTitle}>
          {isSignup ? "Crie sua conta!" : "Que bom ter você aqui!"}
        </h3>
        <p className={styles.modalSub}>
          {isSignup 
            ? "Preencha os dados abaixo para criar sua conta."
            : "Para participar de um 4um é necessário fazer login."}
        </p>

        {serverError && (
          <div className="error-msg server-error">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <>
              <label className="label">Nome de usuário</label>
              <input
                className={`input ${errors.username ? "input-error" : ""}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
                disabled={loading}
              />
              {errors.username && (
                <div className="error-msg">{errors.username}</div>
              )}
            </>
          )}

          <label className="label">E-mail</label>
          <input
            type="email"
            className={`input ${errors.email ? "input-error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={loading}
          />
          {errors.email && <div className="error-msg">{errors.email}</div>}

          <label className="label">Senha</label>
          <input
            type="password"
            className={`input ${errors.password ? "input-error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? "Mínimo 8 caracteres" : "Sua senha"}
            disabled={loading}
          />
          {errors.password && (
            <div className="error-msg">{errors.password}</div>
          )}

          {isSignup && (
            <>
              <label className="label">Confirmar senha</label>
              <input
                type="password"
                className={`input ${errors.passwordConfirm ? "input-error" : ""}`}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirme sua senha"
                disabled={loading}
              />
              {errors.passwordConfirm && (
                <div className="error-msg">{errors.passwordConfirm}</div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-primary-login" disabled={loading}>
              {loading ? "Carregando..." : (isSignup ? "Cadastrar" : "Entrar")}
            </button>
          </div>
        </form>

        <div className="modal-toggle">
          <p>
            {isSignup ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleMode}
              disabled={loading}
            >
              {isSignup ? "Fazer login" : "Cadastre-se"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
