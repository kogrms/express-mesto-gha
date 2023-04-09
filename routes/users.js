const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers,
  getUsersById,
  getUserNow,
  editUsers,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserNow);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUsers);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(
      /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i
    ),
  }),
}), editAvatar);
router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUsersById);

module.exports = router;
