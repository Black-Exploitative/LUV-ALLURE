// services/databaseService.js
const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.connection = null;
  }

  async connect(uri) {
    try {
      this.connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true, // Create indexes automatically
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });

      console.log('MongoDB Connected Successfully');
      
      // Setup connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB Connection Error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Disconnected');
      });

      return this.connection;
    } catch (error) {
      console.error('MongoDB Connection Failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
    }
  }

  // Utility method for transactions
  async withTransaction(fn) {
    const session = await mongoose.startSession();
    
    try {
      return await session.withTransaction(async () => {
        return await fn(session);
      });
    } catch (error) {
      console.error('Transaction Error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Bulk write operations
  async bulkWrite(model, operations) {
    return await model.bulkWrite(operations);
  }
}

module.exports = new DatabaseService();