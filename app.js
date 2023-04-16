require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');

const NotFoundError = require('./errors/not-found-error');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { postUsers, login } = require('./controllers/users');
const { STATUS_500 } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const options = {
  origin: [
    'https://localhost:3001',
    'http://localhost:3001',
    'https://kogrms.nomoredomains.monster',
    'http://kogrms.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.header('origin') || '*');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.status(204).end();
});

app.use(requestLogger);

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().pattern(/^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), postUsers);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { status = STATUS_500, message } = err;
  res
    .status(status)
    .send({
      message: (status === STATUS_500)
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
