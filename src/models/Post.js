const { validateFields } = require('../utils/validator');
const logger = require('../utils/logger');
const { ObjectId } = require('mongodb');
const mongoClient = require('../database/mongoClient');

class Post {
  static collectionName = 'posts';

  static async createPost(data) {
    try {
      validateFields(data, ['user_id', 'content']);
      const db = await mongoClient.connect();
      const result = await db.collection(this.collectionName).insertOne({
        user_id: new ObjectId(data.user_id),
        content: data.content,
        created_at: new Date()
      });

      return result.insertedId;
    } catch (err) {
      logger.error(err.message)
      throw err;
    }
  }

   /**
     * Encontra um post específico pelo seu ID.
     * @param {string} postId - O ID do post a ser buscado.
     * @returns {Promise<object|null>} O documento do post ou null.
     */
    static async findPostById(postId) {
        try {
            const db = await mongoClient.connect();
            // A conversão para new ObjectId() é a parte crucial!
            const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
            return post;
        } catch (error) {
            // Um erro comum aqui é o postId ter um formato inválido, o que quebra new ObjectId()
            logger.error(`[Post.findPostById] Erro ao buscar post: ${error.message}`);
            // Retornamos null para que a rota possa tratar como "não encontrado"
            return null; 
        }
    }

  /**
     * Busca todos os posts de um usuário específico.
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<Array>} Uma lista de posts do usuário, com os mais recentes primeiro.
     */
    static async findPostsByUserId(userId) {
        try {
            const db = await mongoClient.connect();
            const posts = await db.collection('posts')
                .find({ user_id: new ObjectId(userId) }) // Filtra pelo ID do usuário
                .sort({ created_at: -1 }) // Ordena pelos mais recentes
                .toArray();
            return posts;
        } catch (error) {
            logger.error(`[Post.findPostsByUserId] ${error.message}`);
            throw error;
        }
    }

  static async deletePost(id) {
    try {
      const db = await mongoClient.connect();
      const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (err) {
      logger.error(err.message)
      throw err;
    }
  }

  /**
     * Atualiza o conteúdo de um post específico.
     * @param {string} postId - O ID do post a ser atualizado.
     * @param {string} newContent - O novo conteúdo para o post.
     * @returns {Promise<object>} O resultado da operação de atualização.
     */
    static async updatePost(postId, newContent) { // 1. ADICIONE ESTE NOVO MÉTODO
        try {
            const db = await mongoClient.connect();
            const result = await db.collection('posts').updateOne(
                { _id: new ObjectId(postId) },          // Critério de busca: o post com este ID
                { $set: { content: newContent } }       // Operação de atualização: define o novo conteúdo
            );
            return result;
        } catch (error) {
            logger.error(`[Post.updatePost] ${error.message}`);
            throw error;
        }
    }

     static async findAllPosts() {
        try {
            const db = await mongoClient.connect();
            const posts = await db.collection('posts').aggregate([
                {
                    // Junta com a coleção 'users'
                    $lookup: {
                        from: 'users',              // a outra coleção
                        localField: 'user_id',      // campo em 'posts'
                        foreignField: '_id',        // campo em 'users'
                        as: 'author'                // nome do novo campo que será um array
                    }
                },
                {
                    // Desconstrói o array 'author' para ser um objeto
                    $unwind: '$author'
                },
                {
                    // Ordena pelos mais recentes
                    $sort: { created_at: -1 }
                }
            ]).toArray();
            return posts;
        } catch (error) {
            logger.error(`[Post.findAllPosts] ${error.message}`);
            throw error;
        }
    }
}

module.exports = Post;
