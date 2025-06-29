const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const logger = require('../utils/logger');
const ensureAuth = require('../middleware/ensureauth');

/**
 * @route   POST /api/comments
 * @desc    Criar um novo comentário (usado pelo formulário do site)
 * @access  Private
 */
router.post('/comments', ensureAuth, async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const { post_id, comment } = req.body;

        await Comment.createComment({ post_id, user_id, comment });
        
        res.redirect(`/posts/${post_id}`);
    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Ocorreu um erro ao criar o comentário.');
    }
});

/**
 * @route   GET /comments/post/:postId
 * @desc    Buscar todos os comentários de um post específico
 * @access  Public
 */
router.get('/comments/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findCommentsByPost(postId);

    res.status(200).json(comments);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os comentários.' });
  }
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Deletar um comentário
 * @access  Private (Protegido e somente o dono pode excluir)
 */
router.delete('/comments/:id', ensureAuth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const existingComment = await Comment.findCommentById(commentId);
        if (!existingComment) return res.status(404).send('Comentário não encontrado');

        if (existingComment.user_id.toString() !== req.session.user.id) {
            return res.status(403).send('Ação não autorizada.');
        }

        const postId = existingComment.post_id;
        await Comment.deleteComment(commentId);
        res.redirect(`/posts/${postId}`); 
    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Erro ao deletar o comentário.');
    }
});

/**
 * @route   PATCH /api/comments/:id
 * @desc    Atualizar um comentário
 * @access  Private (Protegido e somente o dono pode editar)
 */
router.patch('/comments/:id', ensureAuth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const { comment: newCommentText, post_id } = req.body;

        const existingComment = await Comment.findCommentById(commentId);
        if (!existingComment) return res.status(404).send('Comentário não encontrado');

        if (existingComment.user_id.toString() !== req.session.user.id) {
            return res.status(403).send('Ação não autorizada.');
        }

        await Comment.updateComment(commentId, newCommentText);
        res.redirect(`/posts/${post_id}`); 
    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Erro ao atualizar o comentário.');
    }
});


module.exports = router;