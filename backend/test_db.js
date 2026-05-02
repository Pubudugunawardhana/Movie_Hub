const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://pubudugunawardhana23_db_user:moviehub123@ac-ai8kmr8-shard-00-00.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-01.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-02.5afsgy6.mongodb.net:27017/moviehub?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas directly!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
