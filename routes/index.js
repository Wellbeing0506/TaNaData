var express = require('express');
var nameList = require('../config/nameList.js');
var router = express.Router();
var Passport = require('passport');
var captchapng = require('captchapng');
var moment = require('moment');
var events = require('events');
var Config = require('../config/sysConfig'),
    config = new Config();
var redis = require('redis');
var client = redis.createClient(config.redis.port,config.redis.ip,config.redis.option);

/* GET home page. */
router.get('/', function(req, res, next) {
	var list = {};
	var proxy = new events.EventEmitter();
	proxy.setMaxListeners(0);	
	var count = 0;
	proxy.on("each",function(message,type,item,result) {
		count = (message === "success") ? count+1:count;	
		list[type]= (list.hasOwnProperty(type)) 
				? list[type] 
				: {};
		list[type][item] = (list[type].hasOwnProperty(item)) 
				? list[type][item]
				: result;
		if(message === "error") {
  		if(req.session.passport){
	  		res.render('index.ejs',{nameList:nameList,user:req.session.passport.user, videoList : list});
  		}else{
		 	 	res.render('index.ejs',{nameList:nameList,user:{username:"",role:""}, videoList:list});
  		}
		} 
		if(count === total_length) {
			console.log(list);
  		if(req.session.passport){
	  		res.render('index.ejs',{nameList:nameList,user:req.session.passport.user, videoList : list});
  		}else{
		 	 	res.render('index.ejs',{nameList:nameList,user:{username:"",role:""}, videoList:list});
  		}
		}
	});
	var total_length = 0;
	Object.keys(nameList).forEach(function(i,e){
		client.SMEMBERS(config.redis.keyHead+"_Category_"+i,function(err,result) {
			if(err) { 
				proxy.emit("each","error",i,err) ;
			} else {
				if(result.length > 0) {
				total_length += result.length;
				result.forEach(function(thisOne) {
        	client.HGETALL(config.redis.keyHead+"_Video_"+thisOne,function(err,item){
        	  if(err) {
        	    console.log("[error] redis get video detail fail",err);
        	    proxy.emit('each',"error");
        	  } else {
        	    proxy.emit("each","success",i,thisOne,item);
        	  }
        	});
				});
				}
			}
		});
		
	});



//  if(req.session.passport){
//	  res.render('index.ejs',{nameList:nameList,user:req.session.passport.user, videoList : list});
//  }else{
//	  res.render('index.ejs',{nameList:nameList,user:{username:"",role:""}, videoList:{}});
//  }
});


/* login page */
router.get('/login',function(req,res,next) {
      res.render('login.ejs',{message:req.flash('LoginMessage'),nameList:nameList,user:{username:"",role:""}});
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
	res.writeHead(200,{
		'Content-Type' : 'image/png'
	});
	res.end(imgbase64);
});

/* logout */ 
router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');
});

/* video management */ 
router.get('/videoManagement',isLoggedIn,function(req,res){
	var user = req.user;
	res.render('videoManagement',{nameList:nameList,user:user});
});

/* vidoe list */
router.get('/videoList/:type',function(req,res){
	var proxy = new events.EventEmitter();
	proxy.setMaxListeners(0);	
	var count = 0;
	var list = {};
	proxy.on("detail",function(message,item,detail,each,len){
		count = (message === "success") ? count+1 : count;	
		list[item] = detail;
		if(message === "error" ){
			res.send({message:"error",data:"video list fail"});
			proxy.removeListener("detail",function(){console.log("redis wrong");});
		}
		if(count === len) {
			proxy.removeListener("detail",function(){console.log("redis done");});
			res.send({message:"success",data:list});
		}
	});
	client.SMEMBERS(config.redis.keyHead+"_Category_"+req.params.type,function(err,result){
		if(err) {
			res.send({message:"error",data:"video list fail"});
		} else {
			for(var i in result) {
				client.HGETALL(config.redis.keyHead+"_Video_"+result[i],function(err,item){
					if(err) {
    	      console.log("[error] redis get video detail fail",err);
    	      proxy.emit('detail',"error");		
					} else {
						console.log(result);
						proxy.emit("detail","success",result[i],item,i,result.length);
					}
				});
			}	
		}
	});
});


/* add vidoe */
router.post('/videoAdd',function(req,res){
	var proxy = new events.EventEmitter();
	proxy.setMaxListeners(0);	
	var count = 0;
	var now=moment().format('YYYY-MM-DD h:mm:ss');
	var thisUser = JSON.parse(req.body.thisUser);
	if(thisUser.role === "admin") {
		var regular = /id_(\S{13})NA/;
		var test = regular.test(req.body.videoURL);
		var id = regular.exec(req.body.videoURL);
		if(regular.test(req.body.videoURL)){
			proxy.on('close',function(message){
				count = (message === "success") ? count+1 : count;
				if(message === "error") {
					res.send({message:"error",data:"video insert wrong"});
					proxy.removeListener('close',function(){
						console.log("redis wrong");
					});
				}
				if(count === 2) {
					res.send({message:"success",data:"video done"});
				}
			});
			/* add id into category video ste */
			client.SADD(config.redis.keyHead+"_Category_"+req.body.type,id[1],function(err,result){
				if(err) {
					console.log("[error] redis insert catergory fail",err);	
					proxy.emit('close',"error");
				} else {
					proxy.emit('close',"success");
				}
			});
			/* add vidoe info into vidoe hash */
			var videoHash = ["name",req.body.videoName, "description",req.body.videoDescription, "creater",thisUser.username,"createdTime",now,"sourceFrom","YouKu"];
			client.HMSET(config.redis.keyHead+"_Video_"+id[1],videoHash,function(err,result) {
				if(err) {
					console.log("[error] redis hash fail",err);	
					proxy.emit('close',"error");
				} else {
					proxy.emit('close',"success");
				}
			});
		} else {
			res.send({message:"fail",data:"video URL is wrong!"});
		}
	} else {
		res.send({message:"fail",data:"you done't have permission to access"});
	}
});


/* isLoggedIn function */
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

module.exports = router;
