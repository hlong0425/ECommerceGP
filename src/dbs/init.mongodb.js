dotenv.config();
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
import configs from '../configs/config.mongodb.js';

const { db } = configs[env];

const connectionString = `mongodb://127.0.0.1:${db.port}/${db.name}`;
console.log(connectionString);

class Database {
  _instance = null;

  constructor() {
    this.connect();
  }

  connect(type = 'mongdb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectionString, { maxPoolSize: 50 })
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(err));
  }

  static getInstance() {
    if (!Database._instance) {
      Database._instance = new Database();
    }

    return Database._instance;
  }
}

export default Database.getInstance();
