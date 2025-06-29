// src/routes/postRoutes.js

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensureauth'); 
const logger = require('../utils/logger');

// ROTA POST / -> Para criar um novo post
// Caminho agora é '/', resultando em POST /api/posts/
router.post('/posts', ensureAuth, async (req, res) => {
    try {
        const user_id = req.session.user.id; 
        const { content } = req.body;
        await Post.createPost({ user_id, content });
        res.redirect('/dashboard');
    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Ocorreu um erro ao criar o post.');
    }
});

/**
 * @route   DELETE /:id
 * @desc    Deletar um post pelo seu ID
 */
// Caminho agora é '/:id', resultando em DELETE /api/posts/:id
router.delete('/posts/:id', ensureAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findPostById(postId);

        if (!post) {
            // Se o post não for encontrado, podemos redirecionar ou mostrar erro
            return res.status(404).send('Post não encontrado.');
        }

        if (post.user_id.toString() !== req.session.user.id) {
            return res.status(403).send('Ação não autorizada.');
        }

        await Post.deletePost(postId);
        res.redirect('/dashboard');
        
    } catch (error) {
        logger.error(error.message);
        // A mensagem que você viu veio daqui.
        res.status(500).send('Ocorreu um erro ao deletar o post.');
    }
});

/**
 * @route   PATCH /:id
 * @desc    Atualizar (editar) um post
 */
// Caminho agora é '/:id', resultando em PATCH /api/posts/:id
router.patch('/posts/:id', ensureAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).send('O conteúdo não pode ser vazio.');
        }

        const post = await Post.findPostById(postId);
        if (!post) {
            return res.status(404).send('Post não encontrado.');
        }

        if (post.user_id.toString() !== req.session.user.id) {
            return res.status(403).send('Ação não autorizada.');
        }

        await Post.updatePost(postId, content);
        res.redirect('/dashboard');

    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Ocorreu um erro ao atualizar o post.');
    }
});

module.exports = router;