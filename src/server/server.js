process.on('uncaughtException', (err) => {
  console.log('Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const dotenv = require('dotenv');
const connectionDB = require('./utils/connectDB');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const mongoose = require("mongoose");

dotenv.config({ path: `${__dirname}/config.env` });

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log('Server started!');
  await connectionDB();
});

const io = new Server(server, {
  cors: {
  origin: [
    "http://localhost:5173",
    "https://tech4um-grupo7-1.onrender.com"
  ],
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {},
  maxHttpBufferSize: 1e7
});

// Lista de usuários online
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_forum", (data) => {
    const { forumId, userData } = data;
    socket.join(forumId);

    if (!onlineUsers.has(forumId)) {
      onlineUsers.set(forumId, new Map());
    }

    onlineUsers.get(forumId).set(socket.id, {
      socketId: socket.id,
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
      joinedAt: new Date()
    });

    const usersInForum = Array.from(onlineUsers.get(forumId).values());
    io.to(forumId).emit("users_online_updated", usersInForum);
  });

  socket.on("leave_forum", (forumId) => {
    socket.leave(forumId);

    if (onlineUsers.has(forumId)) {
      onlineUsers.get(forumId).delete(socket.id);

      if (onlineUsers.get(forumId).size === 0) {
        onlineUsers.delete(forumId);
      } else {
        const usersInForum = Array.from(onlineUsers.get(forumId).values());
        io.to(forumId).emit("users_online_updated", usersInForum);
      }
    }
  });

 
  socket.on("start_typing", ({ forumId, userData }) => {
    console.log("✏️ Usuário digitando:", userData);

    socket.to(forumId).emit("user_typing", {
      userId: userData.userId,
      username: userData.username
    });
  });

  socket.on("stop_typing", ({ forumId, userData }) => {
    console.log("🛑 Usuário parou de digitar:", userData);
  
    socket.to(forumId).emit("user_stopped_typing", {
      userId: userData.userId
    });
  });
  

  socket.on("send_message", async (data) => {
    console.log("📨 Mensagem recebida no servidor:", {
      forumId: data.forumId,
      sender: data.sender,
      senderType: typeof data.sender,
      to: data.to,
      text: data.text || data.content,
      image: data.image ? `${data.image.size} bytes` : 'Sem imagem'
    });

    if (!data.text?.trim() && !data.content?.trim() && !data.image) {
      socket.emit("message_error", { error: "Mensagem deve conter texto ou imagem" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(data.sender)) {
      console.error("❌ Sender inválido:", data.sender);
      socket.emit("message_error", { error: "ID do usuário inválido" });
      return;
    }

    const messageData = {
      forumId: new mongoose.Types.ObjectId(data.forumId),
      sender: new mongoose.Types.ObjectId(data.sender),
      to: data.to ? new mongoose.Types.ObjectId(data.to) : null,
      text: data.text || data.content || null,
      private: !!data.to
    };

    if (data.image) {
      if (data.image.size > 5 * 1024 * 1024) {
        socket.emit("message_error", { error: "Imagem muito grande. Máximo 5MB." });
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(data.image.type)) {
        socket.emit("message_error", { error: "Tipo de arquivo não suportado." });
        return;
      }

      messageData.image = {
        data: Buffer.from(data.image.data),
        contentType: data.image.type,
        originalName: data.image.name || "imagem.jpg",
        size: data.image.size
      };
    }

    try {
      const newMessage = await Message.create(messageData);
      
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username email avatar')
        .populate('to', 'username email avatar');

      const payload = {
        _id: populatedMessage._id,
        sender: populatedMessage.sender,
        text: populatedMessage.text,
        content: populatedMessage.text,
        to: populatedMessage.to,
        private: populatedMessage.private,
        isPrivate: populatedMessage.private,
        messageType: populatedMessage.messageType,
        timestamp: populatedMessage.createdAt,
        createdAt: populatedMessage.createdAt
      };

      if (populatedMessage.image?.data) {
        const base64Image = populatedMessage.image.data.toString("base64");
        payload.image = {
          data: `data:${populatedMessage.image.contentType};base64,${base64Image}`,
          contentType: populatedMessage.image.contentType,
          originalName: populatedMessage.image.originalName,
          size: populatedMessage.image.size
        };
      }

      if (data.to) {
        console.log("📮 Enviando mensagem privada");
        
        const senderId = data.sender;
        const recipientId = data.to;
        
        const forumUsers = onlineUsers.get(data.forumId);
        if (forumUsers) {
          forumUsers.forEach((userData, socketId) => {
            if (userData.userId === senderId || userData.userId === recipientId) {
              io.to(socketId).emit("private_message", payload);
            }
          });
        }
      } else {
        console.log("📢 Enviando mensagem pública para fórum:", data.forumId);
        io.to(data.forumId).emit("public_message", payload);
      }

    } catch (err) {
      console.error("❌ Erro ao salvar mensagem:", err);
      socket.emit("message_error", { error: err.message || "Erro ao salvar mensagem" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const [forumId, users] of onlineUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);

        if (users.size === 0) {
          onlineUsers.delete(forumId);
        } else {
          const usersInForum = Array.from(users.values());
          io.to(forumId).emit("users_online_updated", usersInForum);
        }
      }
    }
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
