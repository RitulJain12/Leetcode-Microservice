
const express=require('express');
const router=express.Router();
const middleware=require('../middlewares/user.middleware');
const problemController=require('../controllers/problem.controller');
const problemValidation=require('../validations/problem.validation');



// POST api/problems/create
router.post('/create',middleware.adminMiddleware,problemValidation.validateProblem,problemController.createProblem);

//PUT  api/problems/update/:id
router.put('/update/:id',middleware.adminMiddleware,problemValidation.updateProblem,problemController.updateProblem);

//DELETE api/problems/delete/:id
router.delete('/delete/:id',middleware.adminMiddleware,problemController.deleteProblem);

//**    This are Unprotected routes */

//GET api/problems/get/:id
router.get('/get/:id',problemController.getProblem);

//GET api/problems/getall
router.get('/getall',problemController.getAllProblems);








module.exports=router;

