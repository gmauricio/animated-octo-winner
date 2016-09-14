const Boom = require('boom');
const Organization = require('../models/organization');
const Map = require('immutable').Map;

module.exports = {
  create(req, reply) {
    const organization = new Organization(req.payload);
    return organization.save()
      .then(saved => {
        req.server.app.searchClient.addDocument('organization', saved.code, saved.toJSON())
          .then(() => {
            reply(saved.toJSON()).code(201)
          })
          .catch(err => reply(Boom.badImplementation(err)))
      })
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
    if (req.query.name) {
      return req.server.app.searchClient.search('organization', { name: req.query.name })
        .then(results => {reply(results.map(org => Map(org).delete('code').delete('url').toJS()))})
        .catch(err => reply(Boom.badImplementation(err)))
    } else {
      const exclude = req.query.hasOwnProperty('code') ? [] : ['code', 'url'];
      return Organization.find(req.query)
        .then(results => reply(results.map(org => org.toJSON({ exclude }))))
    }
  },

  remove(req, reply) {
    Organization.remove({ code:req.params.code }, (err) => {
      if (err) throw err;
      reply();
    })
  }
}
