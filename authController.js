const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Role = require('./models/Role.js');
const { JWT_TOKEN } = require('./.config.js');

const { validationResult } = require('express-validator');

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, JWT_TOKEN, {
        expiresIn: "24h"
    });
}

class authController {
    async registration(req, res){
        try {
            // Validation user data
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error!', errors });
            }

            // Registration
            const { username, password } = req.body;
            const candidate = await User.findOne({ username, password });
            if (candidate) {
                // User is already registered!
                return res.status(400).json({ message: 'A user with this name is already registered!' });
            } else {
                // User registration
                const hashPassword = bcrypt.hashSync(password, 7);
                const userRole = await Role.findOne({ value: 'user' });
                const user = new User({ username, password: hashPassword, roles: [userRole.value] });
                await user.save();
                return res.json({
                   message: 'User registration access!'
                });
            }
        } catch (e) {
            console.error(e.message);
            res.status(400).json({ message: 'registration error' });
        }
    }
    async login(req, res){
        try {
            // Login user
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Incorrect username' })
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password' })
            }
            // JWT Token
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (e) {
            console.error(e.message);
            res.status(400).json({ message: 'login error' });
        }
    }
    async getUsers(req, res){
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.error(e.message);
            res.status(400).json({ message: 'get user error' });
        }
    }
}

module.exports = new authController();