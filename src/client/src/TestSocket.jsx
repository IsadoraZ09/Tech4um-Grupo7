import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function TestSocket() {
  const [socket] = useState(() => {
    console.log("🔌 Criando conexão Socket.IO...");
    return io("http://localhost:3000");
  });
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log("⚙️ Configurando eventos do socket...");

    socket.on("connect", () => {
      console.log("✅ Evento 'connect' disparado!");
      console.log("🆔 Socket ID:", socket.id);
      setConnected(true);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erro de conexão:", error);
    });

    socket.emit("join_forum", "123");
    console.log("📨 Emitido: join_forum 123");

    socket.on("public_message", (data) => {
      console.log("📩 Mensagem recebida:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Desconectado. Motivo:", reason);
      setConnected(false);
    });

    // Verificar se já está conectado
    if (socket.connected) {
      console.log("✅ Socket já estava conectado!");
      setConnected(true);
    }

    return () => {
      console.log("🧹 Limpando conexão...");
      socket.disconnect();
    };
  }, [socket]);

  function sendMsg() {
    if (!msg.trim()) return;

    console.log("📤 Enviando mensagem:", msg);
    socket.emit("send_message", {
      forumId: "123",
      sender: "UserTeste",
      text: msg
    });
    setMsg("");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧪 Teste de Socket.IO</h1>
      <p>Status: {connected ? "🟢 Conectado" : "🔴 Desconectado"}</p>
      <p>Socket ID: {socket.id || "Aguardando..."}</p>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMsg()}
        placeholder="Digite uma mensagem..."
        style={{ padding: "8px", width: "300px", marginRight: "8px" }}
      />

      <button onClick={sendMsg} style={{ padding: "8px 16px" }}>
        Enviar
      </button>

      <h2>Mensagens ({messages.length})</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.length === 0 && (
          <li style={{ color: "#999" }}>Nenhuma mensagem ainda...</li>
        )}
        {messages.map((m, i) => (
          <li key={i} style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
            <strong>{m.sender}:</strong> {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}