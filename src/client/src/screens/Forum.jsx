import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import ParticipantsSidebar from "../components/ForumScreen/ParticipantsSidebar.jsx";
import ChatMain from "../components/ForumScreen/ChatMain";
import RelatedRoomsSidebar from "../components/ForumScreen/RelatedRoomsSidebar";
import ModalLogin from "../components/ModalLogin.jsx";
import { forumAPI } from "../services/api";
import "../styles.css";

export default function Sala_forum() {
  const { salaId } = useParams();
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleSendMessage = async (messageContent) => {
    try {
      // TODO: Implementar envio de mensagem via API
      console.log("Enviando mensagem:", messageContent);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  if (loading) {
    return (
      <div className="sala-forum-bg">
        <Header />
        <div className="sala-forum-main">
          <p>Carregando fórum...</p>
        </div>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className="sala-forum-bg">
        <Header />
        <div className="sala-forum-main">
          <p className="error-message">{error || "Fórum não encontrado"}</p>
          <Link to="/" className="sala-forum-back">
            <span className="arrow-left">&#8592;</span> Voltar para o dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sala-forum-bg">
      <Header />
      <div className="sala-forum-main">
        <ParticipantsSidebar participants={sala.participants} />
        <ChatMain sala={sala} onSendMessage={handleSendMessage} />
        <RelatedRoomsSidebar relatedRooms={sala.relatedRooms} />
      </div>

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