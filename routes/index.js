var express = require('express');
var nameList = require('../config/nameList.js');
var router = express.Router();
var Passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.passport){
	  console.log(req.session.passport.user);
	  res.render('index.ejs',{nameList:nameList,user:req.session.passport.user});
  }else{
	  res.render('index.ejs',{nameList:nameList,user:""});
  }
});

router.get('/login',function(req,res,next) {
  res.render('login.ejs',{message:req.flash('LoginMessage'),user:"",nameList:nameList});
});
router.post('/login',
    Passport.authenticate('local-login',{
      successRedirect : '/',
      failureRedirect : '/login',
      failureFlash : true,
    })
);


module.exports = router;
