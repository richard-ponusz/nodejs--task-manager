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

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc3' }, 'isthisgood', { expiresIn: '1 second' });
    console.log('token: ', token);

    const data = jwt.verify(token, 'isthisgood');
    console.log('verify: ', data);
}

myFunction();

