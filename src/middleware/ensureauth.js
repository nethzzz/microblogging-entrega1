/**
 * Middleware para garantir que o usuário está autenticado via sessão.
 * Se não estiver, redireciona para a página de login.
 */
function ensureAuth(req, res, next) {
    if (req.session.user) {
        // Se existe uma sessão de usuário, o usuário está logado.
        // Permite que a requisição continue para a rota.
        return next();
    } else {
        // Se não há sessão, redireciona para a página de login.
        res.redirect('/login');
    }
}

module.exports = ensureAuth;