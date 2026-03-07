const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log("Submission Auth Token:", token);
        console.log("Submission Auth Cookies:", req.cookies);

        if (!token) {
            console.log("No token found in submission middleware");
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.Jwt_key);
        req.user = decoded;
        console.log("Submission Auth Decoded:", decoded);
        next();
    } catch (error) {
        console.error("Submission Auth Error:", error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}


module.exports = {
    authMiddleware
};