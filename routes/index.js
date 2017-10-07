var express = require('express');
var nameList = require('../config/nameList.js');
var router = express.Router();
var Passport = require('passport');
var captchapng = require('captchapng');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.passport){
	  console.log(req.session.passport.user);
	  res.render('index.ejs',{nameList:nameList,user:req.session.passport.user});
  }else{
	  res.render('index.ejs',{nameList:nameList,user:""});
  }
});


/* login page */
router.get('/login',function(req,res,next) {
      res.render('login.ejs',{message:req.flash('LoginMessage'),nameList:nameList,user:""});
});
router.post('/login',
    Passport.authenticate('local-login',{
      successRedirect : '/',
      failureRedirect : '/login',
      failureFlash : true,
    })
);

/* validation png */ 
router.get('/captcha.png',function(req,res){
	var vcode = parseInt(Math.random()*9000+1000);
	req.session.checkcode = vcode;
	var p = new captchapng(66,20,vcode);
	p.color(99,109,129,168);
	p.color(80,80,80,255);
	var img = p.getBase64();
	var imgbase64 = new Buffer(img,'base64');
	console.log("vcode",req.session.checkcode,vcode);
	res.writeHead(200,{
		'Content-Type' : 'image/png'
	});
	res.end(imgbase64);
});

/* logout */ 
router.get('/logout',function(req,res){
  req.logout();
  console.log(req);
  res.redirect('/login');
});
/* isLoggedIn function */
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

module.exports = router;
