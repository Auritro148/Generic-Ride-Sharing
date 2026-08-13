const jwt = require('jsonwebtoken');

/** @type {import('express').RequestHandler} */

function varifyToken(req, res, next) {

    const Header = req.headers.authorization || '';
    if (!Header) {
        return res.status(401).json({
            message: "authorization header missing"
        })
    }

    const Token = Header.split(" ").at(1);

    try {
        const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY)
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: ' token expired' });
        }
        return res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports={varifyToken};
