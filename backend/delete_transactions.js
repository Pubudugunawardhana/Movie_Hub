const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

mongoose.connect('mongodb://pubudugunawardhana23_db_user:moviehub123@ac-ai8kmr8-shard-00-00.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-01.5afsgy6.mongodb.net:27017,ac-ai8kmr8-shard-00-02.5afsgy6.mongodb.net:27017/moviehub?ssl=true&authSource=admin&retryWrites=true&w=majority')
  .then(async () => {
    console.log('Connected to DB...');
    const result = await Transaction.deleteMany({});
    console.log('Deleted transactions:', result);
    process.exit(0);
  })
  .catch(err => {
    console.log('Error:', err);
    process.exit(1);
  });
