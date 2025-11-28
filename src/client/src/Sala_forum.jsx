import Header_login from "./components/Header_login";
import "./styles.css";
import { useParams, Link } from "react-router-dom";
import ModalLogin from "./components/ModalLogin.jsx";
import { useState, useRef, useEffect } from "react";
import { forumAPI } from "./services/api";

export default function Sala_forum() {
  const { salaId } = useParams();
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal login acessibilidade
  const [modalOpen, setModalOpen] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    fetchForumDetails();
  }, [salaId]);

  const fetchForumDetails = async () => {
    try {
      setLoading(true);
      const response = await forumAPI.getForum(salaId);
      setSala(response.data.data.forum);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar fórum");
      console.error("Erro ao buscar fórum:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="sala-forum-bg">
        <Header_login />
        <div className="sala-forum-main">
          <p>Carregando fórum...</p>
        </div>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className="sala-forum-bg">
        <Header_login />
        <div className="sala-forum-main">
          <p className="error-message">{error || "Fórum não encontrado"}</p>
          <Link to="/" className="sala-forum-back">
            <span className="arrow-left">&#8592;</span> Voltar para o dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Responsivo: grid 3/2/1 colunas
  return (
    <div className="sala-forum-bg">
      <Header_login />
      <div className="sala-forum-main">
        {/* Sidebar Participantes */}
        <aside className="sala-forum-sidebar" aria-label="Participantes">
          <Link to="/" className="sala-forum-back">
            <span className="arrow-left">&#8592;</span> Voltar para o dashboard
          </Link>
          <h3 className="sala-forum-sidebar-title">Participantes</h3>
          <div className="sala-forum-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5a6 6 0 100 12 6 6 0 000-12z"
                stroke="#5A7BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 16l6 6"
                stroke="#5A7BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Buscar participante"
              value={participantQuery}
              aria-label="Buscar participante"
              onChange={(e) => setParticipantQuery(e.target.value)}
            />
          </div>
          <ul className="sala-forum-participants">
            {sala.participants
              ?.filter((p) =>
                p.username
                  .toLowerCase()
                  .includes(participantQuery.trim().toLowerCase())
              )
              .map((p) => (
                <li key={p._id} className="sala-forum-participant">
                  <span
                    className="sala-forum-avatar"
                    style={{
                      background: p.avatar ? "none" : p.color || "#e0e0e0",
                      color: p.color || "#e0e0e0",
                    }}
                  >
                    {p.avatar ? <img src={p.avatar} alt={p.username} /> : null}
                  </span>
                  <span className="sala-forum-participant-name">
                    {p.username}
                  </span>
                  <button
                    type="button"
                    className="sala-forum-private-action"
                    aria-label={`Enviar mensagem privada para ${p.username}`}
                  >
                    <span
                      className="sala-forum-private-icon"
                      aria-hidden="true"
                    >
                      💬
                    </span>
                    <span>Enviar mensagem para {p.username.split(" ")[0]}</span>
                  </button>
                </li>
              ))}
          </ul>
        </aside>

        {/* Chat principal */}
        <main className="sala-forum-chat-main" aria-label="Mensagens da sala">
          <div className="sala-forum-chat-header">
            <h2 className="sala-forum-chat-title">{sala.name}</h2>
            <span className="sala-forum-chat-criador">
              Criado por: <b>{sala.creator?.username}</b>
            </span>
          </div>
          <div className="sala-forum-chat-messages">
            {sala.messages?.map((m, i) => (
              <div
                key={m._id || i}
                className={`sala-forum-message${
                  m.isPrivate ? " sala-forum-message-private" : ""
                }`}
              >
                <div className="sala-forum-message-body">
                  <span className="sala-forum-message-author">
                    {m.sender?.username}
                  </span>
                  <span className="sala-forum-message-text">
                    {m.isPrivate ? (
                      <b className="sala-forum-private-label">{m.content}</b>
                    ) : (
                      m.content
                    )}
                  </span>
                </div>
                <span
                  className="sala-forum-avatar sala-forum-avatar-msg"
                  style={{
                    background: m.sender?.avatar
                      ? "none"
                      : m.sender?.color || "#e0e0e0",
                    border: `2px solid #fff`,
                  }}
                >
                  {m.sender?.avatar ? (
                    <img src={m.sender.avatar} alt={m.sender.username} />
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          <div className="sala-forum-chat-typing">
            Amanda Oliveira está digitando...
          </div>
          <form
            className="sala-forum-chat-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="sala-forum-chat-form-bar">
              <span className="sala-forum-chat-form-label">
                Enviando para todos do 4um
              </span>
              <div className="sala-forum-chat-bar-actions">
                <button
                  type="button"
                  className="sala-forum-chat-bar-btn"
                  aria-label="Inserir emoji"
                >
                  😊
                </button>
                <button
                  type="button"
                  className="sala-forum-chat-bar-btn"
                  aria-label="Enviar imagem"
                >
                  📷
                </button>
              </div>
            </div>
            <div className="sala-forum-chat-form-inputs">
              <input
                className="sala-forum-chat-input"
                placeholder="Escreva aqui uma mensagem maneira para mandar para os colegas..."
                aria-label="Mensagem"
              />
              <button
                type="submit"
                className="sala-forum-chat-send-btn"
                title="Enviar"
              >
                <span className="sala-forum-send-arrow">&#8594;</span>
              </button>
            </div>
          </form>
        </main>

        {/* Salas laterais (mantém estático, pode ser dinâmico se quiser) */}
        <aside
          className="sala-forum-sidebar sala-forum-sidebar-right"
          aria-label="Tópicos"
        >
          {sala.relatedRooms?.map((s) => (
            <div key={s._id} className="sala-forum-side-room">
              <div className="sala-forum-side-room-title">
                {s.name.length > 18 ? s.name.slice(0, 15) + "..." : s.name}
              </div>
              <div className="sala-forum-side-room-pessoas">{s.participants}</div>
            </div>
          ))}
        </aside>
      </div>
      {/* Modal de login acessível, se necessário */}
      {modalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Login"
          tabIndex={-1}
          ref={modalRef}
        >
          <ModalLogin onClose={() => setModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
