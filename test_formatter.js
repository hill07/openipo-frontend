const { formatIndianNumber } = require('./utils/formatters');

const testCases = [
    { input: 1234567, expected: '12,34,567' },
    { input: 46022638, expected: '4,60,22,638' },
    { input: 1000, expected: '1,000' },
    { input: 999, expected: '999' },
    { input: 100000, expected: '1,00,000' },
    { input: null, expected: '' },
];

let failed = false;
testCases.forEach(({ input, expected }) => {
    const result = formatIndianNumber(input);
    if (result !== expected) {
        console.error(`FAILED: Input ${input} => Expected '${expected}', Got '${result}'`);
        failed = true;
    } else {
        console.log(`PASSED: Input ${input} => ${result}`);
    }
});

if (!failed) console.log('All tests passed!');
