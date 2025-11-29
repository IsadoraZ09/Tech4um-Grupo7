import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useSocketContext } from "../contexts/SocketContext";
import Header from "../components/Header/Header.jsx";
import ParticipantsSidebar from "../components/ForumScreen/ParticipantsSideBar/ParticipantsSidebar.jsx";
import ChatMain from "../components/ForumScreen/ChatMain/ChatMain.jsx";
import RelatedRoomsSidebar from "../components/ForumScreen/RelatedRoomsSidebar/RelatedRoomsSidebar.jsx";
import ModalLogin from "../components/Header/ModalLogin.jsx";
import { forumAPI, messageAPI } from "../services/api";
import styles from "./Forum.module.css";
import "../styles/global.css";

export default function Forum() {
  const { salaId } = useParams();
  const navigate = useNavigate();
  const { user, openLogin, loading } = useAuth();

  const [forum, setForum] = useState(null);
  const [forumLoading, setForumLoading] = useState(true);
  const [allMessages, setAllMessages] = useState([]); // Todas as mensagens
  const [filteredMessages, setFilteredMessages] = useState([]); // Mensagens filtradas
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(null); // { id, username }
  const [userForums, setUserForums] = useState([]); // Adicionar estado para fóruns do usuário
  const modalRef = useRef(null);

  const {
    isConnected,
    onlineUsers,
    typingUsers, // Novo estado
    joinForum,
    leaveForum,
    sendMessage,
    startTyping, // Novas funções
    stopTyping,
    onPublicMessage,
    onPrivateMessage,
    onMessageError,
    offMessageListeners
  } = useSocketContext();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
        openLogin();
        return;
      }
      checkForumAccess();
      fetchUserForums(); // Buscar fóruns do usuário
    }
  }, [user, loading, salaId]);

  const checkForumAccess = async () => {
    try {
      setForumLoading(true);
      const response = await forumAPI.getForum(salaId);
      const forumData = response.data.data.forum;

      const isMember = forumData.members?.some(
        m => m._id === user.id || m === user.id
      );

      if (!isMember) {
        navigate("/");
        alert("Você não tem acesso a este fórum.");
        return;
      }

      setForum(forumData);
    } catch (err) {
      navigate("/");
      alert("Erro ao acessar o fórum.");
    } finally {
      setForumLoading(false);
    }
  };

  // Função para buscar fóruns do usuário
  const fetchUserForums = async () => {
    try {
      const response = await forumAPI.getAllForums();
      const allForums = response.data?.data?.forums || [];
      
      // Filtrar apenas os fóruns onde o usuário é membro
      const userMemberForums = allForums.filter(f => 
        f.members?.some(m => 
          (typeof m === 'string' ? m : m._id || m.id) === (user._id || user.id)
        )
      );
      
      console.log('👤 Fóruns do usuário:', userMemberForums);
      setUserForums(userMemberForums);
    } catch (err) {
      console.error("❌ Erro ao buscar fóruns do usuário:", err);
    }
  };

  // Função para filtrar mensagens baseadas no usuário atual
  const filterMessagesForUser = (messages, currentUserId) => {
    return messages.filter(message => {
      // Se não é privada, todos podem ver
      if (!message.private && !message.isPrivate) {
        return true;
      }
      
      // Se é privada, só o remetente e o destinatário podem ver
      if (message.private || message.isPrivate) {
        const senderId = message.sender?._id || message.sender?.id || message.sender;
        const recipientId = message.to?._id || message.to?.id || message.to;
        
        return senderId === currentUserId || recipientId === currentUserId;
      }
      
      return true;
    });
  };

  // Atualizar mensagens filtradas quando mensagens ou usuário mudam
  useEffect(() => {
    if (user && allMessages.length > 0) {
      const filtered = filterMessagesForUser(allMessages, user._id || user.id);
      setFilteredMessages(filtered);
      console.log('📊 Mensagens filtradas:', {
        total: allMessages.length,
        filtered: filtered.length,
        userId: user._id || user.id
      });
    } else {
      setFilteredMessages(allMessages);
    }
  }, [allMessages, user]);

  const fetchMessages = async () => {
    try {
      console.log("🔍 Buscando mensagens para sala:", salaId);
      const res = await messageAPI.getMessages(salaId);
      console.log("📜 Mensagens do banco:", res.data?.data?.messages);
      
      const messagesFromAPI = res.data?.data?.messages || [];
      setAllMessages(messagesFromAPI);
    } catch (err) {
      console.error("❌ Erro ao buscar mensagens:", err);
    }
  };

  useEffect(() => {
    if (forum) fetchMessages();
  }, [forum]);

  useEffect(() => {
    if (!salaId || !isConnected || !user) return;

    joinForum(salaId, {
      userId: user._id || user.id,
      username: user.username || user.email,
      email: user.email
    });

    // --- LISTENERS ---
    onPublicMessage((msg) => {
      console.log("📩 Mensagem pública recebida:", msg);
      setAllMessages(prev => {
        const newMessages = [...prev, msg];
        console.log("📝 Todas as mensagens após pública:", newMessages.length);
        return newMessages;
      });
    });

    onPrivateMessage((msg) => {
      console.log("📮 Mensagem privada recebida:", msg);
      setAllMessages(prev => {
        const newMessages = [...prev, msg];
        console.log("📝 Todas as mensagens após privada:", newMessages.length);
        return newMessages;
      });
    });

    onMessageError((err) => {
      console.error("❌ Erro de mensagem:", err);
      alert("Erro ao enviar mensagem: " + err.error);
    });

    return () => {
      leaveForum(salaId);
      offMessageListeners();
    };
  }, [salaId, isConnected, user]);

  const handleSendMessage = (msg) => {
    if (!user) {
      setModalOpen(true);
      return;
    }

    if (!msg.content && !msg.image) return;

    console.log("🚀 Enviando mensagem:", {
      ...msg,
      to: msg.to,
      isPrivate: !!msg.to
    });

    sendMessage({
      forumId: salaId,
      sender: user._id || user.id,
      content: msg.content,
      text: msg.content,
      image: msg.image ?? null,
      to: msg.to ?? null,
      timestamp: new Date().toISOString()
    });

    // NÃO limpar o modo privado automaticamente
    // O usuário deve clicar no X para cancelar
  };

  const handleStartTyping = () => {
    if (user) {
      const userData = {
        userId: user._id || user.id,
        username: user.username || user.email,
      };
      startTyping(salaId, userData);
    }
  };

  const handleStopTyping = () => {
    if (user) {
      const userData = {
        userId: user._id || user.id,
        username: user.username || user.email,
      };
      stopTyping(salaId, userData);
    }
  };

  // Handler para ativar modo privado
  const handlePrivateMessageClick = (participant) => {
    console.log("💬 Modo privado ativado para:", participant);
    setPrivateMode({
      id: participant.id,
      username: participant.username
    });
  };

  // Handler para cancelar modo privado
  const handleCancelPrivateMode = () => {
    console.log("❌ Cancelando modo privado");
    setPrivateMode(null);
  };

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => (document.body.style.overflow = "");
  }, [modalOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // ESC para cancelar modo privado
      if (event.key === 'Escape' && privateMode) {
        handleCancelPrivateMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [privateMode]);

  if (loading || forumLoading) return <div>Carregando...</div>;
  if (!forum) return null;

  return (
    <div className={styles.forumScreen}>
      <Header />

      <main className={styles.salaForum}>
        <aside className={styles.salaForumLeft}>
          <ParticipantsSidebar 
            participants={forum.members || []}
            onlineUsers={onlineUsers}
            onPrivateMessageClick={handlePrivateMessageClick}
          />
        </aside>

        <section className={styles.salaForumCenter}>
          <ChatMain
            sala={{ ...forum, messages: filteredMessages }} // Usar mensagens filtradas
            onSendMessage={handleSendMessage}
            loading={forumLoading}
            error={error}
            isConnected={isConnected}
            privateMode={privateMode}
            onCancelPrivateMode={handleCancelPrivateMode}
            // Novas props para digitação
            typingUsers={typingUsers}
            currentUserId={user?._id || user?.id}
            onStartTyping={handleStartTyping}
            onStopTyping={handleStopTyping}
          />
        </section>

        <aside className={styles.salaForumRight}>
          <RelatedRoomsSidebar 
            userForums={userForums}
            currentForumId={salaId}
            currentForum={forum}
          />
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
