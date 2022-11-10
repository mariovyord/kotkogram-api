const { app, io } = require('./src/app');
const database = require('./src/config/database');

const port = process.env.PORT || 5000;
const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/kotkogram-api';

(async function start() {
    // database connection
    await database(connectionString)

    // start app
    const server = app.listen(port, () => console.log(`Server is listening on port ${port}...`));

    io.attach(server);
})()