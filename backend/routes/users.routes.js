module.exports = (app) => {
  const userController = require('../controllers/user.controller');
  const { verifyToken } = require('../middlewares/authJwt');
  const router = require('express').Router();

  router.put('/avatar', verifyToken, userController.updateAvatar);
  router.get('/me', verifyToken, userController.getProfile);

  app.use('/api/users', router);
};
