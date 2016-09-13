const server = require('./src/server');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

server.register([
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: { 
      info: {
        title: 'Organizations Test API Documentation',
        version: Pack.version,
      }
    }
  },
  {
    register: require('hapi-mongoose-db-connector'),
    options: {
      mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/organizations-api'
    }
  }
], (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
