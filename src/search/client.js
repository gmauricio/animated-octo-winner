const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client( {  
  host: process.env.BONSAI_URL || 'http://localhost:9200'
});

module.exports = function(indexName) {
  client.indices.exists({ index: indexName }).then(exists => {
    if (!exists) {
      client.indices.create({ index });
    }
  });

  return {
    addDocument: (type, document) => client.index({  
      index: indexName,
      type,
      body: document
    }),
    
    search: (type, query) => client.search({
      index: indexName,
      type,
      body: {
        query: {
          match: query
        }
      }
    }).then(resp => resp.hits.hits.map(hit => hit._source))
  }
}