const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
});

test('Should convert 32 F to 0 C"', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});

test('Should convert 0C to 32F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2);
//         done();
//     }, 2000)
// });

test('Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
});

test('Should add two numbers async/await', async () => {
    const sum = await add(7, 8);
    expect(sum).toBe(15);
});