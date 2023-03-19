const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const STATUS_500 = require('./utils/constants');
const NotFoundError = require('./errors/not-found-error');

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/mestodb';

mongoose.connect(url);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64116c098734342bc4a5389b'
  };
  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.use('/*', (req, res, next) => {
  const error = new NotFoundError('Страница не найдена');
  next(error);
});

// app.use((error, req, res, next) => {
//   res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
//   next(error);
// });

app.use((error, req, res, next) => {
  const { status = STATUS_500, message } = error;
  res
    .status(status)
    .send({
      message: (status === STATUS_500)
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(port);

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}...`);
// });
