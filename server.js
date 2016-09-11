'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
  host: 'localhost', 
  port: process.env.PORT || 8000 
});

// Add the route
server.route({
  method: 'GET',
  path:'/echo', 
  handler: (request, reply) => {
    return reply('Echo!');
  }
});

module.exports = server;