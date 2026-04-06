const jwt = require('jsonwebtoken');
const axios = require('axios');
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
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}
async function adminMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.Jwt_key);
        const { id } = decoded;
        const user = await axios.get(`http://localhost:8000/api/users/role/${id}`);
        if (user.data.role === 'admin') {
            req.user = user.data;
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}


module.exports = {
    authMiddleware,
    adminMiddleware
};