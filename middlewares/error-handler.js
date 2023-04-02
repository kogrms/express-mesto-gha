const {
  STATUS_400,
  STATUS_409,
  STATUS_500,
  STATUS_401
} = require('../utils/constants');

const errorHandler = (err, req, res) => {
  if (err.name === 'CastError') {
    return res.status(STATUS_400).send({ message: 'Переданы некорректные данные' });
  }

  if (err.code === 11000) {
    return res.status(STATUS_409).send({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(STATUS_401).send({ message: 'Необходима авторизация' });
  }

  return res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
};

module.exports = errorHandler;
