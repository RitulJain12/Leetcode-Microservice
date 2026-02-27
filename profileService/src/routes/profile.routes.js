
const express=require('express');
const router=express.Router();
const {authMiddleware}=require('../middlewares/user.middleware');
const profileController=require('../controllers/profile.controller');



// POST api/profiles/:id
router.get('/:id',profileController.getProfileById);








module.exports=router;

