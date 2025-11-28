import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../features/AuthContext.jsx";
import Header from "../components/Header/Header.jsx";
import ParticipantsSidebar from "../components/ForumScreen/ParticipantsSideBar/ParticipantsSidebar.jsx";
import ChatMain from "../components/ForumScreen/ChatMain/ChatMain.jsx";
import RelatedRoomsSidebar from "../components/ForumScreen/RelatedRoomsSidebar/RelatedRoomsSidebar.jsx";
import ModalLogin from "../components/Header/ModalLogin.jsx";
import { forumAPI } from "../services/api";
import styles from "./Forum.module.css";
import "../styles/global.css";

export default function Forum() {
  const { salaId } = useParams();
  const { user } = useAuth();
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
      await forumAPI.sendMessage(salaId, messageContent);
      fetchForumDetails();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.forumScreen}>
        <Header />
        <div className={styles.salaForumLoading}>
          <div className="spinner"></div>
          Carregando fórum...
        </div>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className={styles.forumScreen}>
        <Header />
        <div className={styles.salaForumError}>
          <h2>Ops! Algo deu errado</h2>
          <p>{error || "Fórum não encontrado"}</p>
          <Link to="/" className={styles.salaForumBackLink}>
            <span className={styles.arrowLeft}>&#8592;</span> 
            Voltar para o dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.forumScreen}>
      <Header />
      <main className={styles.salaForum}>
        <aside className={styles.salaForumLeft}>
          <ParticipantsSidebar participants={sala.participants || []} />
        </aside>
        
        <section className={styles.salaForumCenter}>
          <ChatMain 
            sala={sala} 
            onSendMessage={handleSendMessage}
            loading={loading}
            error={error}
          />
        </section>
        
        <aside className={styles.salaForumRight}>
          <RelatedRoomsSidebar relatedRooms={sala.relatedRooms || []} />
        </aside>
      </main>

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