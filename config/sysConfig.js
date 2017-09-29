
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
				ip : "10.128.26.74",
				port : 6379,
				option : {auth_pass:"1rjDri7HvNb5A1XA"},
				keyHead : "ZhiGong"
			}};
	}
};
