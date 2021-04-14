const jwt = require('jsonwebtoken');
const { JWT_TOKEN } = require('../.config.js');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') next();
    try {
        // 0 - TYPE ; 1 - TOKEN
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(403).json({ message: 'Not a token' });
        }
        const decodedData = jwt.verify(token, JWT_TOKEN);
        req.user = decodedData;
        next();
    } catch (e) {
        console.error(e.message);
        return res.status(403).json({ message: 'Incorrect request' });
    }
};