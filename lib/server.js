'use strict';

// load env variables
// require('dotenv').load();

// load deps
const Hapi = require('hapi');

// load database
const db = require('./database');
const auth = require('./auth');

// instantiate a new server
const server = new Hapi.Server();

// set the port for listening
server.connection({
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT
});

// Expose database
if (process.env.NODE_ENV === 'test') {
  server.database = db;
}

// load routes
const plugins = ['todo', 'user'].map(function (entity) {
  return {
    register: require('./entities/' + entity + '/' + entity + '-routes'),
    options: {database: db}
  };
});

plugins.push({register: auth});

server.register(plugins, (err) => {
  if (err) {
    throw err;
  }

  if (!module.parent) {
    server.start((err) => {
      if (err) {
        throw err;
      }

      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }
});

module.exports = server;
