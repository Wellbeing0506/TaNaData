var express = require('express');
var nameList = require('../config/nameList.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(nameList);
	res.render('index.ejs',{nameList:nameList,user:""});
});

router.get('/login',function(req,res,next) {

});



module.exports = router;
