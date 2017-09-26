var express = require('express');
var router = express.Router();
var logger = require('tracer').colorConsole();

/* GET home page. */
router.get('/', function(req, res, next) {
	logger.log("demo");	
  res.render('index', { title: '智工網' });
});

module.exports = router;
