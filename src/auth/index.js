const JWT = require('jsonwebtoken');
const Joi = require('joi');
const Boom = require('boom');
const Map = require('immutable').Map;

const secretKey = process.env.JWT_SECRET_KEY || 'ThisIsSupposedToBeAVerySecretKey';
const users = {
  admin: {
    id: 1,
    password: 'p4ssw0rd',
    role: 'admin',
    username: 'admin'
  }
}

const validate = (decoded, request, callback) => {
  if (!decoded.role == 'admin') {
    return callback(null, false);
  } else {
    return callback(null, true);
  }
};

module.exports.register = (server, options, next) => {
  server.register(require('hapi-auth-jwt2'), (err) => {
    server.auth.strategy('jwt', 'jwt', { 
      key: secretKey,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    });

    //server.auth.default('jwt');

    server.route({
      method: 'POST', path: '/auth',
      handler: (request, reply) => {
        const username = request.payload.username;
        const password = request.payload.password;
        if (users[username] && password == users[username].password) {
          const obj = Map(users[username]).delete('password').toJS();
          const token = JWT.sign(obj, secretKey);
          reply({ token: token })
        } else {
          reply(Boom.badRequest('invalid credentials'))
        }
      },
      config: {
        tags: ['api'],
        validate: {
          payload: {
            username: Joi.string().description('the user name').example('admin'),
            password: Joi.string().description('the user password').example('p4ssw0rd'),
          }
        }
      }
    })

    server.route({
      method: 'GET', path: '/auth/me',
      handler: (request, reply) => {
        reply(request.auth.credentials)
          .header("Authorization", request.headers.authorization);
      }, 
      config: { 
        auth: 'jwt',
        tags: ['api'],
        validate: {
          headers: Joi.object().keys({
            Authorization: Joi.string().description('JWT Authorization token'),
          }).unknown()
        }
      }
    });  
  });
  next();
}

module.exports.register.attributes = {
  name: 'auth',
  version: '0.0.1'
};
