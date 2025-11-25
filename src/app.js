const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const forumRouter = require('./routers/forumRouter');
const messageRouter = require('./routers/messageRouter');
const userRoutes = require('./routers/userRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests have been made!',
});

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

app.use(morgan('dev'));

// CORS configurado corretamente
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true, // Permite cookies
}));

app.use(mongoSanitize());

app.use(xssClean());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

if (process.env.NODE_ENV === 'production') app.use('/api', limiter);

// Rotas da API
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/users', userRoutes);

//Routing react-route-dom
app.all('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.all('/api/v1/*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;