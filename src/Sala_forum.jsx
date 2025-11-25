import Header_login from "./components/Header_login";
import "./Sala_forum.css";
import { useParams, Link } from "react-router-dom";
import ModalLogin from "./components/ModalLogin.jsx";
import { useState, useRef, useEffect } from "react";

// Dados de exemplo para múltiplas salas
const salas = {
  "product-development-stuff": {
    titulo: "Product Development Stuff",
    criador: "Lara Alves",
    participantes: [
      {
        nome: "Lara Alves",
        cor: "#F9C74F",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      { nome: "Luiz Antonio Magalhães", cor: "#F94144" },
      { nome: "Gustavo Marcondes", cor: "#F3722C" },
      { nome: "Lucas Pinheiro", cor: "#277DA1" },
      { nome: "Bruna Pires Lacerda", cor: "#90BE6D" },
      { nome: "Gabriella Rodrigues Souza", cor: "#43AA8B" },
      { nome: "Leandro Silva Maciel", cor: "#577590" },
      { nome: "Sandra Reis", cor: "#F9844A" },
      { nome: "Wellington Resende Pereira", cor: "#577590" },
      { nome: "José Thiago Miranda", cor: "#43AA8B" },
      { nome: "Amanda Oliveira", cor: "#F8961E" },
      { nome: "Camilla Santana", cor: "#F3722C" },
      { nome: "Alberto Teixeira", cor: "#90BE6D" },
    ],
    mensagens: [
      {
        autor: "Lara Alves",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        texto:
          "Olá, pessoal! Agora temos esse espaço para falar sobre produto e dev :) Fiquem à vontade para mandar o que acharem que faz sentido aqui.",
      },
      { autor: "Lucas Pinheiro", texto: "Eba!!! Cadê esse pessoal animado?" },
      { autor: "Arthur Silva", texto: "👋👋👋👋👋👋👋👋👋👋" },
      {
        autor: "Gabrielle Rodrigues Souza",
        texto:
          "Chegou o meu momento de descarregar um monte de link aqui pra geral 😁",
      },
      {
        autor: "Wellington Resende Pereira",
        texto: "mensagem privada",
        privado: true,
      },
      {
        autor: "Wellington Resende Pereira",
        texto: "Estou com vergonha de interagir aqui hahahaha",
      },
    ],
  },
  "referencias-boas": {
    titulo: "Referências Boas",
    criador: "Carlos M.",
    participantes: [
      { nome: "Carlos M.", cor: "#43AA8B" },
      { nome: "Equipe Ops", cor: "#eb520e" },
    ],
    mensagens: [{ autor: "Carlos M.", texto: "Aqui só entra referência top!" }],
  },
};

const sidebarRooms = [
  {
    titulo: "product-development-stuff",
    criador: "Lara Alves",
    pessoas: "Lara Alves • 48 pessoas",
    badge: "+115",
  },
  {
    titulo: "Designers_na_firma",
    criador: "Lucas Gomes",
    pessoas: "Lucas Gomes • 55 pessoas",
  },
  {
    titulo: "Referências Boas",
    criador: "Carlos M.",
    pessoas: "Carlos M. • 2 pessoas",
  },
  {
    titulo: "Assistência Tech",
    criador: "Equipe Ops",
    pessoas: "Equipe Ops • 12 pessoas",
  },
  {
    titulo: "Manda um nome para esse 4um",
    criador: "Nome do Criador",
    pessoas: "Um nome • 70 pessoas",
  },
  {
    titulo: "Manda uma nota para esse fórum",
    criador: "Nome do Criador",
    pessoas: "Um nome • 70 pessoas",
  },
];

export default function Sala_forum() {
  const { salaId } = useParams();
  const sala = salas[salaId] || salas["product-development-stuff"];
  // Modal login acessibilidade
  const [modalOpen, setModalOpen] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");
  const modalRef = useRef(null);
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
            {sala.participantes
              .filter((p) =>
                p.nome
                  .toLowerCase()
                  .includes(participantQuery.trim().toLowerCase())
              )
              .map((p) => (
                <li key={p.nome} className="sala-forum-participant">
                  <span
                    className="sala-forum-avatar"
                    style={{
                      background: p.avatar ? "none" : p.cor,
                      color: p.cor,
                    }}
                    aria-label={
                      p.avatar ? undefined : `Cor do participante ${p.nome}`
                    }
                  >
                    {p.avatar ? <img src={p.avatar} alt={p.nome} /> : null}
                  </span>
                  <span className="sala-forum-participant-name">{p.nome}</span>
                  <button
                    type="button"
                    className="sala-forum-private-action"
                    aria-label={`Enviar mensagem privada para ${p.nome}`}
                  >
                    <span
                      className="sala-forum-private-icon"
                      aria-hidden="true"
                    >
                      💬
                    </span>
                    <span>Enviar mensagem para {p.nome.split(" ")[0]}</span>
                  </button>
                </li>
              ))}
          </ul>
        </aside>

        {/* Chat principal */}
        <main className="sala-forum-chat-main" aria-label="Mensagens da sala">
          <div className="sala-forum-chat-header">
            <h2 className="sala-forum-chat-title">{sala.titulo}</h2>
            <span className="sala-forum-chat-criador">
              Criado por: <b>{sala.criador}</b>
            </span>
          </div>
          <div className="sala-forum-chat-messages">
            {sala.mensagens &&
              sala.mensagens.map((m, i) => {
                const participante = sala.participantes.find(
                  (p) => p.nome === m.autor
                );
                const cor =
                  participante && participante.cor
                    ? participante.cor
                    : "#e0e0e0";
                return (
                  <div
                    key={i}
                    className={`sala-forum-message${
                      m.privado ? " sala-forum-message-private" : ""
                    }`}
                  >
                    <div className="sala-forum-message-body">
                      <span className="sala-forum-message-author">
                        {m.autor}
                      </span>
                      <span className="sala-forum-message-text">
                        {m.privado ? (
                          <b className="sala-forum-private-label">{m.texto}</b>
                        ) : (
                          m.texto
                        )}
                      </span>
                    </div>
                    <span
                      className="sala-forum-avatar sala-forum-avatar-msg"
                      style={{
                        background: m.avatar ? "none" : cor,
                        "--avatar-color": cor,
                        border: `2px solid #fff`,
                      }}
                    >
                      {m.avatar ? <img src={m.avatar} alt={m.autor} /> : null}
                    </span>
                  </div>
                );
              })}
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
          {sidebarRooms.map((s) => (
            <div key={s.titulo} className="sala-forum-side-room">
              <div className="sala-forum-side-room-title">
                {s.titulo.length > 18
                  ? s.titulo.slice(0, 15) + "..."
                  : s.titulo}
              </div>
              <div className="sala-forum-side-room-pessoas">{s.pessoas}</div>
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
