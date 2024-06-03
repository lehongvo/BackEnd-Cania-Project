const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.createTransaction);

router.route('/:id')
    .get(transactionController.getOneTransaction)
    .patch(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction);

// router.route('/scan-new-data').get(transactionController.scanData);

module.exports = router;    