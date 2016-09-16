const Organization = require('./model');
const Map = require('immutable').Map;

module.exports = searchClient => ({
  find: query => {
    if (query.name) {
      return searchClient.search('organization', { name: query.name })
        .then(results => results.map(org => Map(org).delete('code').delete('url').toJS()))
    } else {
      const exclude = query.hasOwnProperty('code') ? [] : ['code', 'url'];
      return Organization.find(query)
        .then(results => results.map(org => org.toJSON({ exclude })))
    }
  },

  create: data => {
    const organization = new Organization(data);
    return organization.save()
      .then(saved => 
        searchClient.addDocument('organization', saved.code, saved.toJSON())
          .then(() => saved.toJSON())
      )
  }
})