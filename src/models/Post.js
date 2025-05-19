const { connect } = require('../database/mongoClient');
const { validateFields } = require('../utils/validator');
const { logError } = require('../utils/logger');
const { ObjectId } = require('mongodb');

class Post {
  static collectionName = 'posts';

  static async createPost(data) {
    try {
      validateFields(data, ['user_id', 'content']);

      const db = await connect();
      const result = await db.collection(this.collectionName).insertOne({
        user_id: new ObjectId(data.user_id),
        content: data.content,
        created_at: new Date()
      });

      return result.insertedId;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async findPostById(id) {
    try {
      const db = await connect();
      return await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async findPostsByUser(userId) {
    try {
      const db = await connect();
      return await db.collection(this.collectionName)
        .find({ user_id: new ObjectId(userId) })
        .sort({ created_at: -1 })
        .toArray();
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deletePost(id) {
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

module.exports = Post;
