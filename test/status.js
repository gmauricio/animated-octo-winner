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

test.before(t => {
  return server.register([{ 
    register: require('../src/auth') 
  },{
    register: require('../src/organizations')
  },{
    register: require('hapi-api-version'),
    options: {
      validVersions: [1, 2],
      defaultVersion: 1,
      vendorName: 'organizations'
    }
  }])
})

test('GET /status returns version 1 by default', async t => {
  const options = {
    method: "GET",
    url: "/status"
  };

  const response = await server.inject(options);
  t.is(response.result.version, 1);
});

test('GET /status returns specified version number in header', async t => {
  const options = {
    method: "GET",
    url: "/status",
    headers: {
      Accept: 'application/vnd.organizations.v2+json'
    }
  };

  const response = await server.inject(options);
  t.is(response.result.version, 2);
});
