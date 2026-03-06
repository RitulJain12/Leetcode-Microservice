const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log("Token in Middleware:", token);
        console.log("Cookies:", req.cookies);

        if (!token) {
            console.log("No token found, returning 401");
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.Jwt_key);
        req.user = decoded;
        console.log("Decoded User:", decoded);
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}


module.exports = {
    authMiddleware
};