const Hoek = require('hoek');
const Boom = require('boom');
const elasticsearch = require('elasticsearch');

// Declare defaults
const defaults = {
  config: {
    host: "http://localhost:9200",
  },
  index: 'default-index'
}

module.exports.register = (server, options, next) => {
  const settings = Hoek.applyToDefaults(defaults, options);
  const client = new elasticsearch.Client(settings.config);
  const index = settings.index;

  server.app.searchClient = {
    addDocument: (type, id, document) => client.index({  
      index,
      type,
      id,
      body: document
    }),
    
    search: (type, query) => client.search({
      index,
      type,
      body: {
        query: {
          match: query
        }
      }
    }).then(resp => resp.hits.hits.map(hit => hit._source))
  }

  server.expose('client', client);

  //Create index if it doesn't exist
  client.indices.exists({ index: options.index }).then(exists => {
    if (!exists) {
      client.indices.create({ index });
    }
    next();
  });
}

module.exports.register.attributes = {
  name: 'elastic-search',
  version: '0.0.1'
};