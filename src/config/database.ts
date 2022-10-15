import mongoose, { ConnectOptions } from 'mongoose';

export const database = async (connectionString: string) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        console.log('Database connected');
    } catch (err) {
        console.error('Error connecting to database');
        process.exit(1);
    }
}