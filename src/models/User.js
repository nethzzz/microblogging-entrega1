const { validateFields } = require('../utils/validator');
const logger = require('../utils/logger');
const mongoClient = require('../database/mongoClient');
const bcrypt = require('bcryptjs'); // Importamos o bcrypt

class User {
  static collectionName = 'users';

  static async createUser(data) {
    try {
      validateFields(data, ['username', 'email', 'password']);

      const { username, email, password } = data;

      // Gera um "salt" e hashea a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const db = await mongoClient.connect();
      const newUser = await db.collection('users').insertOne({
        username,
        email,
        password: hashedPassword, // Salva a senha hasheada, não a original!
        created_at: new Date()
      });
      return newUser;

    } catch (error) {
      logger.error(`[User.createUser] ${error.message}`);
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const db = await mongoClient.connect();
      // Usamos .findOne para buscar um único documento
      const user = await db.collection('users').findOne({ email: email });
      return user;
    } catch (error) {
      logger.error(`[User.findUserByEmail] ${error.message}`);
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const db = await connect();
      const objectId = require('mongodb').ObjectId;
      return await db.collection(this.collectionName).findOne({ _id: new objectId(id) });
    } catch (err) {
      logger.error(err.message)
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
      logger.error(err.message)
      throw err;
    }
  }
}

module.exports = User;
