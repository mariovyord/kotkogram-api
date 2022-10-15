import app from './app';
import { database } from './config/database';

const port = process.env.PORT || 5000;
const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/kotkogram-api';

(async function start() {
    // database connection
    await database(connectionString)

    // start app
    app.listen(port, () => console.log(`Auth Server is listening on port ${port}...`));
})()