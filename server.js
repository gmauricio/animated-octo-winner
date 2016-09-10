'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
  host: 'localhost', 
  port: 8000 
});

// Add the route
server.route({
  method: 'GET',
  path:'/echo', 
  handler: (request, reply) => {
    return reply('Echo!');
  }
});

// Start the server
// If the script is being required as a module by another script, we don’t start the server
if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;