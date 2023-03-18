// const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const { STATUS_400, STATUS_404, STATUS_500 } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(STATUS_500).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  // if (!ObjectId.isValid(userId)) {
  //   res.status(STATUS_400).send({ message: 'Переданы некорректные данные' });
  //   return;
  // }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: err.message });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(STATUS_500).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(STATUS_500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar
};
