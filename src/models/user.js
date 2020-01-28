const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Taks = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`Password can't contain the world 'password'`);
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// Only return public data, no password or tokens
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// generate and return token
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, 'isthisgood');

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Find user by email then check password isMatch
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plaintext password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
});

// Delete all tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await Taks.deleteMany({ owner: user._id });

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;