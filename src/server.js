process.on('uncaughtException', (err) => {
  console.log('Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const dotenv = require('dotenv');
const connectionDB = require('./utils/connectDB');
const { Server } = require('socket.io');
const Message = require('./models/messageModel'); // ADICIONE ESTA LINHA

dotenv.config({ path: `${__dirname}/config.env` });

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log('Server started!');
  await connectionDB();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {}, 
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_forum", (forumId) => {
    socket.join(forumId);
    console.log(`User ${socket.id} joined forum ${forumId}`);
  });

  socket.on("send_message", async (data) => { // ADICIONE async
    console.log("📨 Mensagem recebida no servidor:", data);
    
    const payload = {
      sender: data.sender,
      text: data.text,
      to: data.to,
      private: !!data.to
    };

    // // SALVAR NO BANCO DE DADOS
    // try {
    //   const newMessage = await Message.create({
    //     forumId: data.forumId,
    //     sender: data.sender,
    //     to: data.to || null,
    //     text: data.text,
    //     private: !!data.to
    //   });

    //   console.log("✅ Mensagem salva no banco:", newMessage._id);

    //   // Adicionar o ID da mensagem ao payload
    //   payload._id = newMessage._id;
    //   payload.createdAt = newMessage.createdAt;

    // } catch (error) {
    //   console.error("❌ Erro ao salvar mensagem:", error);
    //   socket.emit("message_error", { error: "Falha ao salvar mensagem" });
    //   return;
    // }

    // ENVIAR VIA SOCKET.IO
    if (data.to) {
      // mensagem privada
      io.to(data.to).emit("private_message", payload);
      io.to(socket.id).emit("private_message", payload);
    } else {
      // mensagem pública
      io.to(data.forumId).emit("public_message", payload);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});