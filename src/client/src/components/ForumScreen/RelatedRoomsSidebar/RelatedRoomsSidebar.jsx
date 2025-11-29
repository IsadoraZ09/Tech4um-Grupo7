import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { forumAPI } from "../../../services/api";
import JoinConfirmationModal from "../../JoinConfirmationModal/JoinConfirmationModal";
import styles from "./RelatedRoomsSidebar.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function RelatedRoomsSidebar({ 
  currentForumId,
  currentForum,
  title = "Tópicos Relacionados",
  userForums = [] // Lista de fóruns que o usuário já é membro
}) {
  const [relatedRooms, setRelatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  // Função para truncar texto de forma inteligente
  const truncateText = (text, maxLength = 18) => {
    if (!text || typeof text !== 'string') return 'Sem título';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  // Verificar se o usuário é membro de uma sala (versão robusta)
  const isUserMember = (roomId) => {
    if (!roomId || !Array.isArray(userForums)) return false;
    
    return userForums.some(forum => {
      // Checar diferentes formatos possíveis
      if (typeof forum === 'string') return forum === roomId;
      if (typeof forum === 'object' && forum !== null) {
        return forum._id === roomId || 
               forum.id === roomId || 
               forum.forumId === roomId ||
               forum.forum?._id === roomId;
      }
      return false;
    });
  };

  // Buscar salas relacionadas
  const fetchRelatedRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar todas as salas
      const response = await forumAPI.getAllForums();
      const allRooms = response.data.data.forums || [];
      
      // Filtrar salas relacionadas (excluir a sala atual)
      const filteredRooms = allRooms
        .filter(room => room._id !== currentForumId)
        .slice(0, 4); // Limitar a 4 salas relacionadas (já que mostraremos o atual primeiro)
      
      setRelatedRooms(filteredRooms);
    } catch (err) {
      console.error("Erro ao buscar salas relacionadas:", err);
      setError(err.response?.data?.message || "Erro ao carregar tópicos relacionados");
    } finally {
      setLoading(false);
    }
  };

  // Handle click em sala relacionada
  const handleRoomClick = (e, room) => {
    e.preventDefault();
    
    console.log('Room clicked:', room._id);
    console.log('User forums:', userForums);
    console.log('Is member:', isUserMember(room._id));
    
    if (isUserMember(room._id)) {
      // Se é membro, redirecionar diretamente
      window.location.href = `/sala/${room._id}`;
    } else {
      // Se não é membro, mostrar modal de confirmação
      setSelectedRoom(room);
      setShowConfirmModal(true);
    }
  };

  // Confirmar entrada na sala
  const handleJoinConfirm = async () => {
    if (!selectedRoom) return;

    try {
      setIsJoining(true);
      
      // Chamar API para juntar-se ao fórum
      const response = await forumAPI.joinForum(selectedRoom._id);
      
      // Se deu sucesso, fechar modal e redirecionar
      if (response.status === 200 || response.status === 201) {
        setShowConfirmModal(false);
        setSelectedRoom(null);
        
        // Redirecionar para a sala após juntar-se com sucesso
        window.location.href = `/sala/${selectedRoom._id}`;
      }
      
    } catch (error) {
      console.error("Erro ao juntar-se à sala:", error);
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 401) {
        alert("Você precisa estar logado para entrar em uma sala");
      } else if (error.response?.status === 403) {
        alert("Você não tem permissão para entrar nesta sala");
      } else if (error.response?.status === 404) {
        alert("Sala não encontrada");
      } else if (error.response?.status === 409) {
        // Se já é membro, apenas redirecionar
        setShowConfirmModal(false);
        setSelectedRoom(null);
        window.location.href = `/sala/${selectedRoom._id}`;
      } else {
        alert("Erro ao juntar-se à sala. Tente novamente.");
      }
    } finally {
      setIsJoining(false);
    }
  };

  // Cancelar entrada na sala
  const handleJoinCancel = () => {
    setShowConfirmModal(false);
    setSelectedRoom(null);
  };

  useEffect(() => {
    if (currentForumId) {
      fetchRelatedRooms();
    }
  }, [currentForumId]);

  if (loading) {
    return (
      <aside className={styles.salaForumSidebarRight} aria-label={title}>
        <h3 className={styles.salaForumSidebarTitle}>{title}</h3>
        <div className={styles.salaForumLoadingRelated}>
          <div className="spinner"></div>
          Carregando tópicos...
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.salaForumSidebarRight} aria-label={title}>
        <h3 className={styles.salaForumSidebarTitle}>{title}</h3>
        <div className={styles.salaForumEmptyRelated}>
          <p>Erro ao carregar tópicos</p>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className={styles.salaForumSidebarRight} aria-label={title}>
        <h3 className={styles.salaForumSidebarTitle}>{title}</h3>
        
        <div className={styles.salaForumRelatedRoomsContainer}>
          {/* Mostrar o fórum atual primeiro */}
          {currentForum && (
            <div
              className={`${styles.salaForumSideRoom} ${styles.active}`}
              aria-label="Fórum atual"
              title={`${currentForum.title} (Atual)`}
            >
              <span className={styles.salaForumCurrentLabel}>Atual</span>
              <div className={styles.salaForumSideRoomTitle}>
                {truncateText(currentForum.title)}
              </div>
              <div className={styles.salaForumSideRoomPessoas}>
                {currentForum.participants?.length || currentForum.membersCount || 0} participantes
              </div>
            </div>
          )}

          {/* Mostrar salas relacionadas */}
          {relatedRooms.length === 0 && !currentForum ? (
            <div className={styles.salaForumEmptyRelated}>
              <p>Nenhum tópico relacionado ainda</p>
            </div>
          ) : (
            relatedRooms.map((room) => (
              <div
                key={room._id}
                className={styles.salaForumSideRoom}
                onClick={(e) => handleRoomClick(e, room)}
                style={{ cursor: 'pointer' }}
                aria-label={`Ir para sala ${room.title || 'Sem título'}`}
                title={room.title || 'Sem título'}
              >
                <div className={styles.salaForumSideRoomTitle}>
                  {truncateText(room.title)}
                </div>
                <div className={styles.salaForumSideRoomPessoas}>
                  {room.participants?.length || room.membersCount || 0} participantes
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Modal de confirmação */}
      <JoinConfirmationModal
        isOpen={showConfirmModal}
        forum={selectedRoom}
        onConfirm={handleJoinConfirm}
        onCancel={handleJoinCancel}
        isLoading={isJoining}
      />
    </>
  );
}