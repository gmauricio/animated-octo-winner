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
    const conditions = { code: req.payload.code }
    Organization.findOneAndUpdate(conditions, req.payload, {new: true}, (err, org) => {
      if (err) reply(Boom.badImplementation(err))

      if (org) {
        req.server.app.searchClient.addDocument('organization', org.code, org.toJSON())
          .then(() => {
            reply(org.toJSON())
          })
          .catch(err => reply(Boom.badImplementation(err)))
      } else {
        reply().code(404)
      }
    })
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
