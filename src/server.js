process.on('uncaughtException', (err) => {
  console.log('Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const dotenv = require('dotenv');
const connectionDB = require('./utils/connectDB');
const { Server } = require('socket.io');

dotenv.config({ path: `${__dirname}/config.env` });

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log('Server started!');
  await connectionDB();
});

const io = new Server(server, {
  connectionStateRecovery: {}, 
});

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // socket.on('joinRoom', (data) => {
  //   console.log('Cliente pediu para entrar na sala:', data);
  //   socket.join(data.room);
  // });

  // socket.on('chatMessage', (data) => {
  //   io.to(data.room).emit('message', data);
  // });

  // socket.on('disconnect', () => {
  //   console.log('Usuário desconectado');
  // });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
