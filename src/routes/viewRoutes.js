const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensureauth');
const Comment = require('../models/Comment');

/**
 * @route   GET /
 * @desc    Renderiza a página inicial com todos os posts
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAllPosts();
        
        // Renderiza o template 'home.hbs' e passa a lista de posts para ele
        res.render('home', {
            posts: posts, // Os dados que o template vai usar
            user: req.session.user // Passa a informação do usuário logado (se houver)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar os posts.');
    }
});

/**
 * @route   GET /login
 * @desc    Renderiza a página de login
 */
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza o arquivo login.hbs
});

/**
 * @route   GET /register
 * @desc    Renderiza a página de registro
 */
router.get('/register', (req, res) => {
    res.render('register'); // Renderiza o arquivo register.hbs
});

/**
 * @route   GET /logout
 * @desc    Encerra a sessão do usuário
 */
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // Se der erro, volta pra área logada
        }
        res.clearCookie('connect.sid'); // Limpa o cookie da sessão
        res.redirect('/'); // Redireciona para a home
    });
});

/**
 * @route   GET /dashboard
 * @desc    Renderiza o dashboard do usuário com seus posts
 */
//                                   👇
router.get('/dashboard', ensureAuth, async (req, res) => { // 2. Aplique o middleware
    try {
        // Busca os posts do usuário que está na sessão
        const posts = await Post.findPostsByUserId(req.session.user.id);
        
        // Renderiza o template do dashboard, passando os posts e os dados do usuário
        res.render('dashboard', {
            user: req.session.user,
            posts: posts
        });
    } catch (error) {
        console.error(error);
        res.render('error/500'); // (Opcional) Renderiza uma página de erro
    }
});

/**
 * @route   GET /posts/new
 * @desc    Renderiza o formulário para criar um novo post
 */
router.get('/posts/new', ensureAuth, (req, res) => {
    res.render('posts/add', { user: req.session.user }); // Renderiza um novo template
});

/**
 * @route   GET /posts/edit/:id
 * @desc    Renderiza o formulário para editar um post
 */
router.get('/posts/edit/:id', ensureAuth, async (req, res) => {
    try {
        const post = await Post.findPostById(req.params.id);
        if (post.user_id.toString() !== req.session.user.id) {
            return res.redirect('/dashboard'); // Não é o dono, volta pro dashboard
        }
        res.render('posts/edit', { post: post, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
});

/**
 * @route   GET /posts/:id
 * @desc    Renderiza a página de um post específico com seus comentários
 */
router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        // Busca o post e os comentários em paralelo para mais eficiência
        const [post, comments] = await Promise.all([
            Post.findPostById(postId),
            Comment.findCommentsByPost(postId)
        ]);

        if (!post) {
            return res.render('error/404'); // Renderiza uma página de erro 404
        }

        res.render('posts/single', {
            user: req.session.user,
            post: post,
            comments: comments
        });
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
});


/**
 * @route   GET /comments/edit/:id
 * @desc    Renderiza o formulário para editar um comentário
 */
router.get('/comments/edit/:id', ensureAuth, async (req, res) => {
    try {
        const comment = await Comment.findCommentById(req.params.id);
        if (comment.user_id.toString() !== req.session.user.id) {
            return res.redirect('/'); // Não é o dono, redireciona para a home
        }
        res.render('comments/edit', { comment: comment, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
});

module.exports = router;