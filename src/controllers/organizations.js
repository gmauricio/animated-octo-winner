const Organization = require('../models/organization');

module.exports = {
  create(req, reply) {
    const organization = new Organization(req.payload);
    return organization.save()
      .then(saved => reply(saved.toJSON()).code(201))
  },

  list(req, reply) {
    const exclude = req.query.hasOwnProperty('code') ? [] : ['code', 'url'];
    return Organization.find(req.query)
      .then(results => reply(results.map(org => org.toJSON({ exclude }))))
  }
}
