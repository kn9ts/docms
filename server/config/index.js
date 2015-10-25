var customKey = '436b2efb-0302-4113-9954-f658f554ea87',
  envVariables = {
    expressSessionKey: process.env.EXPRESS_SESSION_KEY || customKey,
    database: process.env.DATABASE_NAME || 'document',
    host: process.env.HOST || 'localhost',
    userName: process.env.USER_NAME || 'kn9ts',
    password: process.env.PASSWORD || 'root',
  },
  development = envVariables,
  staging = envVariables,
  production = envVariables;

module.exports = {
  getEnvironment: function(value) {
    var environments = {
      development: development,
      staging: staging,
      production: production,
    };
    return environments[value] !== undefined ? environments[value] : environments.development;
  }
};
