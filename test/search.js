import Hapi from 'hapi';
import test from 'ava';

const server = new Hapi.Server({
  cache: {
    name: 'redisCache',
    engine: require('catbox-redis'),
    partition: 'cache'
  }
});
server.connection({ 
  host: '0.0.0.0', 
  port: 8000 
});

let elasticSearch;
const indexName = 'organizations-test'

test.before(t => {
  return server.register([{
    register: require('../src/organizations')
  },{
    register: require('../src/search'),
    options: {
      config: { host: 'http://localhost:9200' },
      index: indexName
    }
  }]).then(() => {
    elasticSearch = server.plugins['elastic-search'].client;
    return elasticSearch.indices.exists({index: indexName}).then(exists => {
      if (exists) {
        return elasticSearch.indices.delete({index: indexName, type: 'organization', refresh: true})
      }
    })
  })
})

test.after.always(t => {
  return elasticSearch.indices.exists({index: indexName}).then(exists => {
    if (exists) {
      return elasticSearch.indices.delete({index: indexName, type: 'organization'})
    }
  })
})

test.serial('GET /organizations by name return search results', async t => {
  const testOrg = {
    name: 'Super Employer',
    description: 'An employer that is super',
    url: 'http://superemployer.com',
    code: '123xyz',
    type: 'employer'
  };
  
  await elasticSearch.index({
    index: indexName,
    type: 'organization',
    body: testOrg,
    refresh: true
  })
  
  const options = {
    method: "GET",
    url: "/organizations?name=Super"
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.result));
  t.is(response.result.length, 1);
  
  const results = response.result;
  const org = results[0];
  t.is(org.name, testOrg.name);
  t.is(org.description, testOrg.description);
  t.is(org.type, testOrg.type);
});