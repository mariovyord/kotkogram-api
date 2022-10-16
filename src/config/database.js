const mongoose = require('mongoose');

module.exports = async (connectionString) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database connected');
    } catch (err) {
        console.error('Error connecting to database');
        process.exit(1);
    }
}