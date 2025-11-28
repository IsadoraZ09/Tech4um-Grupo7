import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import styles from "./ChatInput.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || attachedFiles.length > 0) && onSendMessage) {
      onSendMessage({
        content: message,
        files: attachedFiles,
      });
      setMessage("");
      setAttachedFiles([]);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      name: file.name,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Fechar emoji picker ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Limpar URLs ao desmontar
  React.useEffect(() => {
    return () => {
      attachedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  return (
    <form className={styles.salaForumChatForm} onSubmit={handleSubmit}>
      <div className={styles.salaForumChatFormBar}>
        <span className={styles.salaForumChatFormLabel}>
          Enviando para todos do 4um
        </span>
        <div className={styles.salaForumChatBarActions}>
          <div className={styles.emojiPickerContainer} ref={emojiPickerRef}>
            <button
              type="button"
              className={styles.salaForumChatBarBtn}
              aria-label="Inserir emoji"
              title="Inserir emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14s1.5 2 4 2 4-2 4-2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="9"
                  y1="9"
                  x2="9.01"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="15"
                  y1="9"
                  x2="15.01"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className={styles.emojiPickerPopup}>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={320}
                  height={400}
                  searchPlaceholder="Buscar emoji..."
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            className={styles.salaForumChatBarBtn}
            aria-label="Enviar imagem ou vídeo"
            title="Enviar imagem ou vídeo"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview dos arquivos anexados */}
      {attachedFiles.length > 0 && (
        <div className={styles.salaForumAttachmentsPreview}>
          {attachedFiles.map((file, index) => (
            <div key={index} className={styles.salaForumAttachmentItem}>
              <button
                type="button"
                className={styles.salaForumAttachmentRemove}
                onClick={() => removeFile(index)}
                aria-label="Remover arquivo"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {file.type === "image" ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className={styles.salaForumAttachmentPreview}
                />
              ) : (
                <video
                  src={file.preview}
                  className={styles.salaForumAttachmentPreview}
                  controls
                />
              )}
              <span className={styles.salaForumAttachmentName}>{file.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.salaForumChatFormInputs}>
        <input
          className={styles.salaForumChatInput}
          placeholder="Escreva aqui uma mensagem maneira para mandar para os colegas..."
          aria-label="Mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className={styles.salaForumChatSendBtn}
          title="Enviar"
          disabled={!message.trim() && attachedFiles.length === 0}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.salaForumSendIcon}
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}