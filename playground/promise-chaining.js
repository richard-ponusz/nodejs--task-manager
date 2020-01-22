require('../src/db/mongoose');
const User = require('../src/models/user');

// 5e09063219c1632fc09ad66c ==== Jason Todd

// User.findByIdAndUpdate('5e09063219c1632fc09ad66c', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e);
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('5e26dad316f753435038bcb5', 14).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})