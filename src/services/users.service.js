import User from '../models/User';
import Post from '../models/Post';

import bcrypt from 'bcrypt';
import Session from '../models/Session';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

exports.signup = async (userData) => {
    const existing = await User.findOne({ username: userData.username.toLowerCase() });

    if (existing) {
        throw new Error('Username already exists')
    }

    const user = new User(userData);
    await user.save();

    const session = await createSession(user);

    return {
        ...session,
        _id: user._id,
    };
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

    const session = await createSession(user);

    return {
        ...session,
        _id: user._id,
    };
}

exports.logout = async (token) => {
    const decoded = jwt.decode(token, { complete: true });
    await Session.findOneAndDelete({ userId: decoded.payload._id });
}

exports.getNewTokens = async (refreshToken) => {
    return new Promise(function (resolve, reject) {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, userData) => {
            if (err) return reject(err);

            Session.findOne({ userId: userData._id })
                .then(x => {
                    bcrypt.compare(refreshToken, x.refreshToken, function (err, result) {
                        if (err) {
                            deleteSessions(userData._id);
                            return reject(err)
                        }
                        if (result) {
                            resolve(createSession(userData));
                        }
                    })
                })
                .catch(err => reject(err));
        })
    })
}

async function deleteSessions(userId) {
    Session.deleteMany({ userId: userId })
        .then(() => console.log('Old sessions deleted'));
}

async function createSession(userData) {
    // Delete old session if any
    deleteSessions(userData._id);
    // Create user
    const user = {
        _id: userData._id,
        username: userData.username,
        role: userData.role
    }
    // Create new tokens
    const result = {
        accessToken: jwt.sign(
            user,
            `${process.env.JWT_SECRET}`,
            // TODO Make expiration time 5m
            { expiresIn: '1d' }
        ),
        refreshToken: jwt.sign(
            user,
            `${process.env.JWT_REFRESH_SECRET}`,
            { expiresIn: '7d' }
        )
    };

    // Create session in DB
    const refreshToken = new Session({
        refreshToken: await bcrypt.hash(result.refreshToken, saltRounds),
        userId: user._id
    })

    await refreshToken.save();

    return result;
}
exports.getUserData = async (userId, isOwner) => {
    if (isOwner) {
        return User.findById(userId).select('-password -__v');
    } else {
        return User.findById(userId).select('-password -__v -role -createdAt -updatedAt');
    }
}

exports.patchUserData = async (userId, data) => {
    const user = await User.findById(userId).select('-password -__v');

    // TODO Add change password option
    user.username = data.username || user.username;
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.imageUrl = data.imageUrl || user.imageUrl;
    user.description = data.description || user.description;

    await user.save();
    return user;

}

exports.getLeaderboard = async () => {
    const aggr = [
        {
            '$project': {
                '_id': 0,
                'owner': 1,
                'score': 1
            }
        }, {
            '$group': {
                '_id': '$owner',
                'totalScore': {
                    '$sum': '$score'
                }
            }
        }, {
            '$sort': {
                'totalScore': -1
            }
        }, {
            '$limit': 50
        }, {
            '$lookup': {
                'from': 'users',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'user',
                'pipeline': [
                    {
                        '$project': {
                            '_id': 0,
                            'username': 1,
                            'firstName': 1,
                            'lastName': 1
                        }
                    }
                ]
            }
        }
    ]

    return (await Post.aggregate(aggr)).map(x => ({ ...x, user: x.user[0] }));
}