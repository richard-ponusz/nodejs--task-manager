const express = require('express');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

const User = require('../models/user');
const auth = require('../middleware/auth');

// Create user
router.post(`/users`, async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login User
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send()
    }
});


// Get currently logged in user's data
router.get('/users/me', auth, async (req, res, next) => {
    res.send(req.user);
});

// Getting all users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(`Couldn't get all users`);
    }
})


// Delete currently logged in user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        // sendCancellationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send(`User successfully logged out`);
    } catch (e) {
        res.status(500).send(`User couldn't log out`);
    }
});

// logout from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('All tokens deleted');
    } catch (e) {
        res.status(500).send('Error during logging out from all sessions');
    }
})

// update the logged in user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Config for 'Upload Avatar Pic' endpoint
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

// Upload Avatar pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 150, height: 150 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Remove avatar pic
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send('Error during deleting avatar pic');
    }
})

// Get avatar image
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error('No user or avatar can be found for this ID!');
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;
// Get specific user
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);

//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send();
//     }
// });
