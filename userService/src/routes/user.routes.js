const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/user.middleware');
const valiations = require('../validations/userdata.validator');
const userController = require('../controllers/user.controller');



// POST  /api/users/register

router.post('/register', valiations.validateUserData, userController.createUser);

// POST  /api/users/login

router.post('/login', valiations.validateUserData, userController.loginUser);

// GET  /api/users/me

router.get('/me', authMiddleware, userController.getMe);

//GET /api/users/role/:id
router.get('/role/:id', userController.getRole);


// GET  /api/users/:id

router.get('/:id', authMiddleware, userController.getUserById);
router.post('/logout', authMiddleware, userController.logoutUser);
router.delete('/profile', authMiddleware, userController.deleteUser);





module.exports = router;