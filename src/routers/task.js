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

<<<<<<< HEAD
// get all tasks, 
// GET tasks?completed=false
// GET tasks?limit=10&skip=4
// GET tasks?sortBy=createdAt:asc /or/ createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

=======
router.get('/tasks', async (req, res) => {
>>>>>>> master
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Get specific task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        res.send(task);
    } catch (e) {
        res.status(404).send();
    }
})

// Delete specific task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            res.status(404).send({ error: 'No task found with that Id!' });
        }

        res.send('Task deleted');
    } catch (e) {
        res.status(500).send();
    }
});

// update specific task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid! One or more properties do not exist on the original object!' });
    };

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            res.status(404).send({ error: 'Not task is found with that ID!' });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status().send(e);
    }
});

module.exports = router;