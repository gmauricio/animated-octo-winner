'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const organizations = require('./controllers/organizations'); 

require('mongoose').Promise = global.Promise;

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
    path: '/status',
    handler: (request, reply) => {
      reply({ version: request.pre.apiVersion });
    }
});

server.route({
  method: 'GET',
  path: '/organizations',
  handler: organizations.list,
  config: {
    tags: ['api'],
    validate: {
      query: {
        code: Joi.string().description('the code of the organization'),
        name: Joi.string().description('the name of the organization'),
      }
    }
  }
});

const organizationSchema = {
  name: Joi.string()
    .required()
    .description('the name of the organization'),
  description: Joi.string().required()
    .description('the description of the organization'),
  url: Joi.string().required()
    .description('the url of the organization'),
  code: Joi.string().required()
    .description('the code of the organization'),
  type: Joi.string().required()
    .valid(['employer', 'insurance', 'health system'])
    .description('the type of the organization (employer, insurance, health system)'),
};

server.route({
  method: 'POST',
  path: '/organizations',
  handler: organizations.create,
  config: {
    tags: ['api'],
    validate: {
      payload: organizationSchema
    }
  }
});

server.route({
  method: 'PUT',
  path: '/organizations',
  handler: organizations.update,
  config: {
    tags: ['api'],
    validate: {
      payload: organizationSchema
    }
  }
});

server.route({
  method: 'DELETE',
  path: '/organizations/{code}',
  handler: organizations.remove,
  config: {
    tags: ['api'],
    validate: {
      params: {
        code: Joi.string().required().description('the code of the organization'),
      }
    }
  }
})

module.exports = server;