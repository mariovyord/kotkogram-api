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

exports.isUsernameUnique = async (username) => {
    const existing = await User.findOne({ username: username.toLowerCase() });

    if (existing) {
        throw new Error('Username already exists')
    }

    return true;
}

exports.patchUserData = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) throw new Error();

    for (let key of Object.keys(data)) {
        console.log(key);
        user[key] = data[key];
    }

    await user.save();
    return user;
}

exports.followUser = async (userId, followedUserId) => {
    const user = await User.findById(followedUserId);

    if (!user) throw new Error('User does not exist');

    const userIndex = user.followers?.indexOf(userId);

    if (userIndex === -1) {
        user.followers.push(userId);
    } else {
        user.followers.splice(userIndex, 1);
    }

    await user.save();
    return user;
}

