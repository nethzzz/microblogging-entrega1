const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @route   POST /api/users/register
 * @desc    Registra um novo usuário (usado pelo formulário)
 */
router.post('/users/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('Este email já está em uso.');
        }
        await User.createUser({ username, email, password });
        
        res.redirect('/login');

    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Ocorreu um erro ao registrar o usuário.');
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Autentica um usuário e cria uma sessão (usado pelo formulário)
 */
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).send('Credenciais inválidas.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Credenciais inválidas.');
        }

        req.session.user = {
            id: user._id,
            username: user.username
        };
        
        res.redirect('/dashboard');

    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Ocorreu um erro ao fazer o login.');
    }
});

module.exports = router;