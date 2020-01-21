require('../src/db/mongoose');
const User = require('../src/models/user');

// 5e09063219c1632fc09ad66c ==== Jason Todd

User.findByIdAndUpdate('5e09063219c1632fc09ad66c',{ age: 1 }).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1 })
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e);
})