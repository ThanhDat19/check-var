const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');


//router.get('/transactions', transactionController.getAll);


router.get('/transactions/search', transactionController.search);


router.post('/transactions', transactionController.create);


router.delete('/transactions/:id', transactionController.deleteById);

module.exports = router;
