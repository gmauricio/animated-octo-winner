'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

require('mongoose').Promise = global.Promise;

const redisConfig = require("redis-url").parse(process.env.REDIS_URL || 'redis://127.0.0.1');
// Create a server with a host and port
const server = new Hapi.Server({
  cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: redisConfig.hostname,
      port: redisConfig.port,
      password: redisConfig.password,
      partition: 'cache'
    }
  ]
});
server.connection({ 
  host: '0.0.0.0', 
  port: process.env.PORT || 8000 
});

server.register([
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: {
      host: process.env.HOST || 'localhost:8000', 
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
  },
  { 
    register: require('./src/auth'),
    options: {
      secretKey: process.env.JWT_SECRET_KEY || 'ThisIsSupposedToBeAVerySecretKey'
    } 
  },
  {
    register: require('./src/search'),
    options: {
      config: {
        host: process.env.BONSAI_URL || 'http://localhost:9200',
      },
      index: 'organizations'
    }
  },
  {
    register: require('hapi-api-version'),
    options: {
      validVersions: [1, 2],
      defaultVersion: 1,
      vendorName: 'organizations'
    }
  },
  { register: require('./src/organizations') }
], (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  // Start the server
  server.start((err) => {
    if (err) {
      console.log('Error starting server', err);
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
