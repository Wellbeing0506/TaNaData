
module.exports = function(){
	if(process.env.NODE_ENV === 'development' ) {
			return {redis : {
				ip : "10.129.4.99",
				port : 6379,
				option : {},
				keyHead : "local"
			}};
	} else {
			return {redis : {
				ip : "172.30.115.242",
				port : 6379,
				option : {auth_pass:'qwe123QWE!@#'},
				keyHead : "ZhiGong"
			}};
	}
};
