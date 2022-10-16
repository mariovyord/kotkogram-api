const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

exports.signup = async (userData) => {
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

exports.login = async (username, password) => {
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

async function createToken(userData) {
    return jwt.sign(
        { _id: userData._id.toString() },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '7d' }
    )
}

exports.getUserData = async (userId) => {
    return User.findById(userId).select('-password -__v');
}

exports.patchUserData = async (userId, data) => {
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
