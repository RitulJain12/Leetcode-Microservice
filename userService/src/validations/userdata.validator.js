const validator = require('validator');

function validateUserData(req, res, next) {
    const { name, email, password } = req.body;
    console.log(req.body);
  //  if(!name) return res.status(404).json({message:"name is Not found"});
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    next();
}

module.exports = {
    validateUserData
}