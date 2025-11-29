import React from "react";
import styles from "./JoinConfirmationModal.module.css";

export default function JoinConfirmationModal({ isOpen, forum, onConfirm, onCancel, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Juntar-se ao Fórum</h3>
        <p className={styles.modalDescription}>
          Deseja juntar-se ao fórum "<strong>{forum?.title}</strong>"?
        </p>
        <div className={styles.modalInfo}>
          <p>• <strong>{forum?.members?.length || forum?.membersCount || 0}</strong> membros ativos</p>
          <p>• Criado por: <strong>{forum?.creator?.username || 'Desconhecido'}</strong></p>
          {forum?.description && (
            <p>• {forum.description}</p>
          )}
        </div>
        <div className={styles.modalActions}>
          <button 
            className={styles.modalCancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalConfirmBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Entrando...
              </>
            ) : (
              'Juntar-se'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}