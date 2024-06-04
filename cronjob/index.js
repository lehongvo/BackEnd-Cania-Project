const schedule = require('node-schedule');

const job = schedule.scheduleJob('*/1 * * * * *', () => {
    console.log('Hello, World!', new Date().toDateString());
});