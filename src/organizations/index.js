const scheme = require('./scheme');
const handlers = require('./handlers');
const Joi = require('joi'); 

module.exports.register = (server, options, next) => {
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
    handler: handlers.list,
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

  server.route({
    method: 'POST',
    path: '/organizations',
    handler: handlers.create,
    config: {
      tags: ['api'],
      validate: {
        payload: scheme
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/organizations',
    handler: handlers.update,
    config: {
      tags: ['api'],
      validate: {
        payload: scheme
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/organizations/{code}',
    handler: handlers.remove,
    config: {
      tags: ['api'],
      validate: {
        params: {
          code: Joi.string().required().description('the code of the organization'),
        }
      }
    }
  })
  next();
}

module.exports.register.attributes = {
  name: 'organizations',
  version: '0.0.1'
};