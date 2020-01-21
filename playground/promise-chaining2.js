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
Task.findByIdAndDelete('5e09080e19c1632fc09ad66e').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e);
})