const { connect } = require('../database/mongoClient');
const { validateFields } = require('../utils/validator');
const { logError } = require('../utils/logger');

class User {
  static collectionName = 'users';

  static async createUser(data) {
    try {
      validateFields(data, ['username', 'email']);

      const db = await connect();
      const result = await db.collection(this.collectionName).insertOne({
        username: data.username,
        email: data.email,
        created_at: new Date()
      });
      return result.insertedId;
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async findUserById(id) {
    try {
      const db = await connect();
      const objectId = require('mongodb').ObjectId;
      return await db.collection(this.collectionName).findOne({ _id: new objectId(id) });
    } catch (err) {
      logError(err);
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      const db = await connect();
      const objectId = require('mongodb').ObjectId;
      const result = await db.collection(this.collectionName).deleteOne({ _id: new objectId(id) });
      return result.deletedCount > 0;
    } catch (err) {
      logError(err);
      throw err;
    }
  }
}

module.exports = User;
