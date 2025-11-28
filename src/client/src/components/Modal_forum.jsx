import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forumAPI } from "../services/api";
import "../styles.css";

export default function ModalCreateForum({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Limpar erro do campo ao digitar
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "O título é obrigatório";
        } else if (formData.title.length < 3) {
            newErrors.title = "O título deve ter no mínimo 3 caracteres";
        } else if (formData.title.length > 100) {
            newErrors.title = "O título deve ter no máximo 100 caracteres";
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = "A descrição deve ter no máximo 500 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await forumAPI.createForum(formData);
            const newForumId = response.data.data.forum._id;

            // Fechar modal e redirecionar para o novo fórum
            onClose();
            navigate(`/sala/${newForumId}`);
        } catch (error) {
            console.error("Erro ao criar fórum:", error);
            setServerError(
                error.response?.data?.message ||
                "Erro ao criar fórum. Tente novamente."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({ title: "", description: "" });
            setErrors({});
            setServerError("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content-create" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-create">
                    <h2 className="modal-title-create">Criar Novo 4um</h2>
                    <button
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Fechar"
                    >
                        <svg
                            width="24"
                            height="24"
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
                </div>

                <form onSubmit={handleSubmit} className="modal-form-create">
                    {serverError && (
                        <div className="server-error">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {serverError}
                        </div>
                    )}

                    <div className="form-group-create">
                        <label htmlFor="title" className="label-create">
                            Título do Fórum <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input-create ${errors.title ? "input-error" : ""}`}
                            placeholder="Ex: Discussões sobre IA"
                            disabled={isSubmitting}
                            maxLength={100}
                        />
                        <div className="char-count">
                            {formData.title.length}/100
                        </div>
                        {errors.title && <p className="error-msg">{errors.title}</p>}
                    </div>

                    <div className="form-group-create">
                        <label htmlFor="description" className="label-create">
                            Descrição (opcional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`textarea-create ${errors.description ? "input-error" : ""
                                }`}
                            placeholder="Descreva sobre o que será discutido neste fórum..."
                            rows={4}
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        <div className="char-count">
                            {formData.description.length}/500
                        </div>
                        {errors.description && (
                            <p className="error-msg">{errors.description}</p>
                        )}
                    </div>

                    <div className="modal-actions-create">
                        <button
                            type="button"
                            className="btn-cancel-create"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-submit-create"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Criando...
                                </>
                            ) : (
                                "Criar Fórum"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}