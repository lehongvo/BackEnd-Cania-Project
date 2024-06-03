const Transaction = require('../models/transactionModel');
const factory = require('./handlerFactory');
const { saveTransactionsFromBlockToDB } = require('../utils/featuresBlockchain');

exports.getAllTransactions = factory.getAll(Transaction);

exports.createTransaction = factory.createOne(Transaction);

exports.getOneTransaction = factory.getOne(Transaction, 'Transaction');

exports.updateTransaction = factory.updateOne(Transaction);

exports.deleteTransaction = factory.deleteOne(Transaction);


