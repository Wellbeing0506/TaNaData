module.exports = {
  apps : [
    {
      name      : 'ZhiGongNet',
      script    : 'server.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      },
			env_development : {
				NODE_ENV: 'development'
			}
    },
  ]
};
