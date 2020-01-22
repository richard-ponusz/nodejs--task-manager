require('../src/db/mongoose');
const Task = require('../src/models/task');

// DELETES ricsi, age 0, password: Request23232
// my solution
// Task.findByIdAndDelete('5dd7eab579c80d620866a469').then(
//     Task.countDocuments({ completed: false }, (err, tasks) => {
//         if (err) {
//             console.log('fuck off');
//         }
//         console.log(tasks)
//     })).catch((e) => {
//         console.log(e);
//     })

// Andrew's solution:
Task.findByIdAndDelete('5dd55aa39dba5d1d0c5caf2b').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log('success', result)
}).catch((e) => {
    console.log('error', e);
})

// with Async/await
const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteTaskAndCount('').then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
})