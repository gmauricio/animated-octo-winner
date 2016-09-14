const Organization = require('../models/organization');
const searchClient = require('../search/client')('organizations');
const Map = require('immutable').Map;

module.exports = {
  create(req, reply) {
    const organization = new Organization(req.payload);
    return organization.save()
      .then(saved => {
        searchClient.addDocument('organization', saved.toJSON()).then(() => {
          reply(saved.toJSON()).code(201)
        })
      })
  },

  update(req, reply) {
    const conditions = { code: req.payload.code }
    Organization.findOneAndUpdate(conditions, req.payload, {new: true}, (err, org) => {
      if (err) throw err;

      if (org) {
        reply(org.toJSON())
      } else {
        reply().code(404)
      }
    })
  },
  
  list(req, reply) {
    if (req.query.name) {
      return searchClient.search('organization', { name: req.query.name })
        .then(results => reply(results.map(org => Map(org).delete('code').delete('url'))))
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
