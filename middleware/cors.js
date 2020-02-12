'use strict';

module.exports = async (c, next) => {
  let methods = [
    'GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'
  ];

  c.setHeader('Access-Control-Allow-Origin', '*');
  c.setHeader('Access-Control-Allow-Methods', methods);
  c.setHeader('Access-Control-Allow-Headers', 'content-type');
  await next(c);
};
