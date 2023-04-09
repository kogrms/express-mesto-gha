const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCard, deleteCardsById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCardsById);
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/\S*)?$/i).required(),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

module.exports = router;
