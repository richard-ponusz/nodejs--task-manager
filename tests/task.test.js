const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    userOne, userOneId, setupDatabase,
    userTwo, userTwoId,
    taskOne, taskTwo, taskThree
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(res.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test(`Should fetch user tasks`, async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.length).toBe(2);
});

test(`Should not be able to delete other user's task`, async () => {
    const res = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull()
})