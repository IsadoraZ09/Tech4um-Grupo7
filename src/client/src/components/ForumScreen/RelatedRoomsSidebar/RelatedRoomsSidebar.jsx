import React, { useState, useEffect, useMemo } from "react";
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

  // Helper: decode simples do payload do JWT para obter o userId
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const [, payloadB64] = token.split(".");
      if (!payloadB64) return null;

      const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(json);
      return payload?.id || payload?._id || payload?.userId || payload?.sub || null;
    } catch {
      return null;
    }
  };

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  // Normaliza uma coleção de forums do usuário para um Set de ids (string)
  const userForumIdSet = useMemo(() => {
    const ids = new Set();
    if (!Array.isArray(userForums)) return ids;

    userForums.forEach((f) => {
      if (!f) return;
      let id =
        (typeof f === "string" && f) ||
        f._id ||
        f.id ||
        f.forumId ||
        (f.forum && (typeof f.forum === "string" ? f.forum : f.forum._id));

      if (id) ids.add(String(id));
    });

    return ids;
  }, [userForums]);

  // Função para truncar texto de forma inteligente
  const truncateText = (text, maxLength = 18) => {
    if (!text || typeof text !== 'string') return 'Sem título';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  // Verificar se o usuário é membro da sala
  const isUserMember = (roomOrId) => {
    const roomId =
      typeof roomOrId === "string"
        ? roomOrId
        : roomOrId?._id || roomOrId?.id || roomOrId?.forumId;

    // 1) Checa se o ID do fórum está na lista passada via prop
    if (roomId && userForumIdSet.has(String(roomId))) return true;

    // 2) Fallback: checa se o usuário atual está listado nos membros/participantes da sala
    if (currentUserId && roomOrId && typeof roomOrId === "object") {
      const members = roomOrId.members || roomOrId.participants || [];
      // members pode ser array de strings (ids) ou objetos de usuário
      const isInMembers = members.some((m) => {
        if (!m) return false;
        if (typeof m === "string") return String(m) === String(currentUserId);
        if (typeof m === "object") {
          return (
            String(m._id) === String(currentUserId) ||
            String(m.id) === String(currentUserId) ||
            String(m.userId) === String(currentUserId)
          );
        }
        return false;
      });
      if (isInMembers) return true;
    }

    return false;
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

    // Se já é membro, redireciona direto e não abre modal
    if (isUserMember(room)) {
      window.location.href = `/sala/${room._id}`;
      return;
    }

    // Caso não seja membro, abre modal de confirmação
    setSelectedRoom(room);
    setShowConfirmModal(true);
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
        isOpen={showConfirmModal && selectedRoom && !isUserMember(selectedRoom)}
        forum={selectedRoom}
        onConfirm={handleJoinConfirm}
        onCancel={handleJoinCancel}
        isLoading={isJoining}
      />
    </>
  );
}