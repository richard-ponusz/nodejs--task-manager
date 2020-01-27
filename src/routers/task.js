const express = require('express');
const router = new express.Router();

const Task = require('../models/task');
const auth = require('../middleware/auth');

// Create new Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

// get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(id);
        res.send(task);
    } catch (e) {
        res.status(404).send();
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            res.status(404).send({ error: 'No task found with that Id!' });
        }

        res.send('Task deleted');
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid! One or more properties do not exist on the original object!' });
    };

    try {
        const task = await Task.findById(_id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            res.status(404).send({ error: 'Not task is found with that ID!' });
        }

        res.send(task);
    } catch (e) {
        res.status().send(e);
    }
});

module.exports = router;