const express=require('express');   
const router=express.Router();
const {authMiddleware}=require('../middlewares/user.middleware');
const valiations=require('../validations/userdata.validator');
const userController=require('../controllers/user.controller');



// POST  /api/users/register

router.post('/register',valiations.validateUserData,userController.createUser);

// POST  /api/users/login

router.post('/login',valiations.validateUserData,userController.loginUser);

// GET  /api/users/me

router.get('/me',authMiddleware,userController.getMe);

// GET  /api/users/:id

router.get('/:id',authMiddleware,userController.getUserById);



module.exports=router;