const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: 4,
        maxlength: 30,
        unique: true,
        validate: {
            validator: noBlacklisterChars,
            message: 'Username should not contain whitespace or special symbols'
        }
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: 1,
        maxlength: 30,
        validate: {
            validator: noBlacklisterChars,
            message: 'First name should not contain whitespace or special symbols'
        }
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: 1,
        maxlength: 30,
        validate: {
            validator: noBlacklisterChars,
            message: 'Last name should not contain whitespace or special symbols'
        }
    },
    password: {
        type: String,
        required: [true, 'Password name is required'],
        minlength: 6,
        maxlength: 60,
    },
    description: {
        type: String,
        maxlength: 100,
        default: '',
    },
    imageUrl: {
        type: String,
        default: 'https://i.imgur.com/73kg6yl.png'
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user'
    },
},
    { timestamps: true }
)

userSchema.plugin(beautifyUnique);

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.pre('save', function (next) {
    this.username = this.username.toLowerCase();
    next();
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Hashing new password');
    }
    next();
})

function noBlacklisterChars(params) {
    return /\W/.test(params) === false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;