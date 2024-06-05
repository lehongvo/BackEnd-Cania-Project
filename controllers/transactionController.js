const Transaction = require('../models/transactionModel');
const BlockData = require('../models/blockNumberModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const IScanData = require('../utils/apiScanData');

exports.getAllTransactions = factory.getAll(Transaction);

exports.createTransaction = factory.createOne(Transaction);

exports.getOneTransaction = factory.getOne(Transaction, 'Transaction');

exports.updateTransaction = factory.updateOne(Transaction);

exports.deleteTransaction = factory.deleteOne(Transaction);

exports.scanNewBlockDatabaseBlock = catchAsync(async (req, res) => {
    await IScanData(req, res);
});


