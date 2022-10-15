import User from '../models/User.model';

import jwt from 'jsonwebtoken';
import { IUser } from '../types/IUser';

export const signup = async (userData: IUser) => {
    const existing = await User.findOne({ username: userData.username.toLowerCase() });

    if (existing) {
        throw new Error('Username already exists')
    }

    const user = new User(userData);
    await user.save();

    const token = await createToken(user);

    return {
        token,
        user,
    }
}

export const login = async (username: string, password: string) => {
    const user = await User.findOne({ username: username });

    if (!user) {
        throw new Error('Incorrect username or password');
    }

    const match = await user.comparePassword(password);

    if (!match) {
        throw new Error('Incorrect username or password');
    }

    const token = await createToken(user);

    return {
        token,
        user,
    }
}

async function createToken(userData: IUser) {
    return jwt.sign(
        { _id: userData._id.toString() },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '7d' }
    )
}

export const getUserData = async (userId: string) => {
    return User.findById(userId).select('-password -__v');
}

export const patchUserData = async (userId: string, data: Partial<IUser>) => {
    const user = await User.findById(userId);

    if (!user) throw new Error();

    if (data.username) user.username = data.username;
    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (data.imageUrl) user.imageUrl = data.imageUrl;
    if (data.description) user.description = data.description;
    if (data.password) user.password = data.password;

    await user.save();
    return user;
}
