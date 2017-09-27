
module.exports = function(){
	switch(process.env.NODE_ENV) {
		case 'development': 
			return {redis : {
				ip : "10.129.4.99",
				port : 6379,
				option : {},
				keyHead : "local"
			}};
		case 'production':
			return {redis : {
				ip : "10.128.26.74",
				port : 6379,
				option : {auth_pass:"1rjDri7HvNb5A1XA"},
				keyHead : "ZhiGong"
			}};
	}
};

//module.exports = {
//	local : {
//		redis : {
//			ip : "10.129.4.99",
//			port : 6379,
//			option : {},
//			keyHead : "local"
//		}	
//	},
//	openshift : {
//		redis : {
//			ip : "10.128.26.74",
//			option : {auth_pass:"1rjDri7HvNb5A1XA"},
//			keyHead : "ZhiGong"
//		}
//	}
//}
