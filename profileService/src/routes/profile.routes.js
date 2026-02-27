
const express=require('express');
const router=express.Router();
const {authMiddleware}=require('../middlewares/user.middleware');
const profileController=require('../controllers/profile.controller');
const validations=require('../validations/updateprofileValidator');


// POST api/profiles/:id
router.get('/:id',authMiddleware,profileController.getProfileById);

//PUT  api/profiles/update
router.put('/update',authMiddleware,validations.profileUpdateMiddleware,profileController.updateProfile);








module.exports=router;

