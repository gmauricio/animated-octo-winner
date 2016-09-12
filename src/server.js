'use strict';

const Hapi = require('hapi');
const organizations = require('./controllers/organizations') 

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: process.env.PORT || 8000 
});

// Add the route
server.route({
  method: 'GET',
  path: '/echo', 
  handler: (request, reply) => {
    return reply('Echo!');
  }
});

server.route({
  method: 'GET',
  path: '/organizations',
  handler: organizations.list
})

server.route({
  method: 'POST',
  path: '/organizations',
  handler: organizations.create
})

module.exports = server;