const Organization = require('../models/organization');

module.exports = {
  create(req, reply) {
    const organization = new Organization(req.payload);
    return organization.save()
      .then(saved => reply(saved.toJSON()).code(201))
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
    const exclude = req.query.hasOwnProperty('code') ? [] : ['code', 'url'];
    return Organization.find(req.query)
      .then(results => reply(results.map(org => org.toJSON({ exclude }))))
  }
}
