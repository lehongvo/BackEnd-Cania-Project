const express = require('express');
const morgan = require('morgan');
const schedule = require('node-schedule');
const IScanData = require('./utils/apiScanData');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const transactionController = require('./routes/transactionRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const job = schedule.scheduleJob('*/10 * * * * *', async () => {
    console.log("Scheduled Task Triggered:", new Date().toDateString());
    try {
        const mockReq = {};
        const mockRes = {
            status: (code) => ({
                json: (data) => console.log(`Mock response: ${code}`, data)
            })
        };
        await IScanData(mockReq, mockRes);
    } catch (error) {
        console.error('Error during scheduled task execution:', error);
    }
    console.log("------------------------------------------------------")
});

// 3) ROUTES
app.use('/api/v1/transactions', transactionController);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;