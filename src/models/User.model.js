const { Schema, Types, model } = require('mongoose');
const bcrypt = require('bcrypt');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

Schema.Types.String.set('trim', true);

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [280, 'Maximum length is 280 characters'],
        unique: true,
        validate: {
            validator: noBlacklistedChars,
            message: 'Username should not contain whitespace or special symbols'
        }
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [280, 'Maximum length is 280 characters'],
        validate: {
            validator: noBlacklistedChars,
            message: 'First name should not contain whitespace or special symbols'
        }
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [280, 'Maximum length is 280 characters'],
        validate: {
            validator: noBlacklistedChars,
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
        maxlength: [280, 'Maximum length is 280 characters'],
        default: '',
    },
    imageUrl: {
        type: String,
        default: 'https://i.imgur.com/73kg6yl.png'
    },
    followers: {
        type: [Types.ObjectId],
        default: [],
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
        if (!noBlacklistedChars(this.password)) throw new Error('Password should not contain whitespace or special symbols')

        this.password = await bcrypt.hash(this.password, 10);
        console.log('Hashing new password');
    }
    next();
})

function noBlacklistedChars(params) {
    return /\W/.test(params) === false;
}
const User = model('User', userSchema);

module.exports = User;