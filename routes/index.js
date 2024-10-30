var express = require('express');
var router = express.Router();
// const { importCSVToMySQL } = require('../configs/database')
/* GET home page. */
router.get('/', function(req, res, next) {
  // importCSVToMySQL('transactions.csv')
  res.render('index', { title: 'Express' });
});

module.exports = router;
