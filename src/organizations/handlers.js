const Boom = require('boom');
const Organization = require('./model');
const OrganizationService = require('./service');

module.exports = {
  create(req, reply) {
    OrganizationService(req.server.app.searchClient).create(req.payload)
      .then(organization => {
        reply(organization).code(201)
      })
      .catch(err => reply(Boom.badImplementation(err)))
  },

  update(req, reply) {
    OrganizationService(req.server.app.searchClient).update(req.payload)
      .then(organization => {
        if (organization) {
          return reply(organization)
        }
        reply().code(404);
      })
      .catch(err => reply(Boom.badImplementation(err)))
  },
  
  list(req, reply) {
    req.server.methods.findOrganizations(req.query, (err, result) => {
      if (err) {
        return reply(Boom.badImplementation(err));
      }
      reply(result);
    })
  },

  remove(req, reply) {
    Organization.remove({ code:req.params.code }).exec().then(() => {
      reply()
    }).catch(err => reply(Boom.badImplementation(err)))
  }
}
