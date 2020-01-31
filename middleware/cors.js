'use strict';

module.exports = async (c, next) => {
  c.setHeader('Access-Control-Allow-Origin', '*');
  c.setHeader('Access-Control-Allow-Methods', this.methods);
  c.setHeader('Access-Control-Allow-Headers', 'content-type');
  await next(c);
};
