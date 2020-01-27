require('./db/mongoose');

const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// PORT
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5e2ee743e2948b0c30f8d628');
    // await task.populate('owner').execPopulate();
    // console.log(task);

    const user = await User.findById('5e2ee64e9e52b346accc80ee');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
};

main();
