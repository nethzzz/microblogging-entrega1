const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

async function main() {
  try {
    console.log("\n=== INICIANDO TESTES ===");

    // 1. Criar um usuário
    const userId = await User.createUser({
      username: 'teste',
      email: 'teste@gmail.com'
    });
    console.log("✅ Usuário criado:", userId);

    // 2. Criar uma postagem
    const postId = await Post.createPost({
      user_id: userId,
      content: 'Essa é minha primeira postagem no microblog!'
    });
    console.log("📝 Post criado:", postId);

    // 3. Criar um comentário na postagem
    const commentId = await Comment.createComment({
      post_id: postId,
      user_id: userId,
      comment: 'Comentando meu próprio post!'
    });
    console.log("💬 Comentário criado:", commentId);

    // 4. Buscar postagens do usuário
    const posts = await Post.findPostsByUser(userId);
    const user = await User.findUserById(userId)
    console.log(`📚 Postagens do usuário "${user.username}":`, posts);

    // 5. Buscar comentários do post
    const comments = await Comment.findCommentsByPost(postId);
    const post = await Post.findPostById(postId)
    console.log(`🗨️ Comentários do post "${post.content}":`, comments);

  } catch (err) {
    console.error("❌ Erro no teste:", err.message);
  }
}

main();
