const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    try {
         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
         console.log(token);
         if (!token) {
             return res.status(401).json({ message: 'Unauthorized' });
         }
        const decoded = jwt.verify(token, process.env.Jwt_key);
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized',error:error });
    }
}


module.exports = {
    authMiddleware
};