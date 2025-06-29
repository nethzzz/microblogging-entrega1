const { connect } = require('../database/mongoClient');
const { validateFields } = require('../utils/validator');
const logger = require('../utils/logger');
const { ObjectId } = require('mongodb');
const mongoClient = require('../database/mongoClient');

class Comment {
  static collectionName = 'comments';

  static async createComment(data) {
    try {
      validateFields(data, ['post_id', 'user_id', 'comment']);

      const db = await connect();
      const result = await db.collection(this.collectionName).insertOne({
        post_id: new ObjectId(data.post_id),
        user_id: new ObjectId(data.user_id),
        comment: data.comment,
        created_at: new Date()
      });

      return result.insertedId;
    } catch (err) {
      logger.error(err.message)
      throw err;
    }
  }

   static async findCommentsByPost(postId) {
        try {
            const db = await mongoClient.connect();
            const comments = await db.collection('comments').aggregate([
                {
                    // Encontra os comentários para o post específico
                    $match: { post_id: new ObjectId(postId) }
                },
                {
                    // Junta com a coleção de usuários
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    // Desconstrói o array de autor para um objeto
                    $unwind: '$author'
                },
                {
                    // Ordena pelos mais recentes
                    $sort: { created_at: -1 }
                }
            ]).toArray();
            return comments;
        } catch (error) {
            logger.error(`[Comment.findCommentsByPost] ${error.message}`);
            throw error;
        }
    }

  static async deleteComment(id) {
    try {
      const db = await connect();
      const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (err) {
      logger.error(err.message)
      throw err;
    }
  }

  /**
   * Encontra um comentário específico pelo seu ID.
   * @param {string} commentId - O ID do comentário a ser buscado.
   * @returns {Promise<object|null>} O documento do comentário ou null se não for encontrado.
   */
  static async findCommentById(commentId) { // 2. ADICIONE ESTE NOVO MÉTODO
    try {
      const db = await mongoClient.connect();
      // Usamos new ObjectId() para converter a string do ID para o formato do MongoDB
      const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
      return comment;
    } catch (error) {
      logger.error(`[Comment.findCommentById] ${error.message}`);
      throw error;
    }
  }

  /**
     * Atualiza o texto de um comentário específico.
     * @param {string} commentId - O ID do comentário a ser atualizado.
     * @param {string} newCommentText - O novo texto para o comentário.
     * @returns {Promise<object>} O resultado da operação de atualização.
     */
    static async updateComment(commentId, newCommentText) { // 1. ADICIONE ESTE NOVO MÉTODO
        try {
            const db = await mongoClient.connect();
            const result = await db.collection('comments').updateOne(
                { _id: new ObjectId(commentId) },
                { $set: { comment: newCommentText } } // Atualiza apenas o campo 'comment'
            );
            return result;
        } catch (error) {
            logger.error(`[Comment.updateComment] ${error.message}`);
            throw error;
        }
    }

}

module.exports = Comment;
