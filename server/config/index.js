'use strict';
module.exports = function(value) {
  var envVariables = {
      expressSessionKey: process.env.EXPRESS_SESSION_KEY,
      database: process.env.DATABASE,
      host: process.env.HOST,
      userName: process.env.USER_NAME,
      password: process.env.PASSWORD,
      webTokenSecret: process.env.WEB_TOKEN_SECRET
    },
    environments = {
      development: envVariables,
      staging: envVariables,
      production: envVariables
    };
  return environments[value] ? environments[value] : environments.development;
};
