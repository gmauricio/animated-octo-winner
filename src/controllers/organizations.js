const Organization = require('../models/organization');

module.exports = {
  create(request, reply) {
    const organization = new Organization(request.payload);
    return organization.save()
      .then(saved => reply(saved.toObject()).code(201))
  }
}
