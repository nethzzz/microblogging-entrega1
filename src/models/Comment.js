const { connect } = require('../database/mongoClient');
const { validateFields } = require('../utils/validator');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

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
      logError(err);
      throw err;
    }
  }

  static async findCommentsByPost(postId) {
    try {
      const db = await connect();
      return await db.collection(this.collectionName)
        .find({ post_id: new ObjectId(postId) })
        .sort({ created_at: -1 })
        .toArray();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deleteComment(id) {
    try {
      const db = await connect();
      const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}

module.exports = Comment;
