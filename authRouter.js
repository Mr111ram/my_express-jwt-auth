const Router = require('express');
const controller = require('./authController.js');
const authMiddleware = require('./middlewares/authMiddleware.js');
const roleMiddlaware = require('./middlewares/roleMiddlaware.js');
const { check } = require('express-validator');

const router = new Router();
const userValidator = [
    check('username', 'Incorrect username').notEmpty().isLength({ min: 4, max: 16 }),
    check('password', 'Incorrect password').notEmpty().isLength({ min: 4, max: 16 }),
]

router.post('/registration', userValidator, controller.registration);
router.post('/login', userValidator, controller.login);
router.get('/users', roleMiddlaware(['admin']), controller.getUsers);

module.exports = router;