const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.post('/scan-new-block-data', transactionController.scanNewBlockDatabaseBlock);

router.route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.createTransaction);

router.route('/:id')
    .get(transactionController.getOneTransaction)
    .patch(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction);

module.exports = router;    