import Hapi from 'hapi';
import test from 'ava';
import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import Organization from '../src/organizations/model';
mongoose.Promise = global.Promise;

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

const orgs = [{
  name: 'Super Employer',
  description: 'An employer that is super',
  url: 'http://superemployer.com',
  code: '123xyz',
  type: 'employer'
},{
  name: 'iSure',
  description: 'A sure organization',
  url: 'http://isure.com',
  code: '468abc',
  type: 'insurance'
}]

const secretKey = 'ThisIsSupposedToBeAVerySecretKey';
let token;

test.before(t => {
  return server.register([{ 
    register: require('../src/auth'),
    options: { secretKey }
  },{
    register: require('../src/organizations')
  },{
    register: require('hapi-mongoose-db-connector'),
    options: {
      mongodbUrl: 'mongodb://localhost:27017/organizations-api-test'
    }
  },{
    register: require('../src/search'),
    options: {
      config: { host: 'http://localhost:9200' },
      index: 'organizations-test'
    }
  }]).then(() => {
    token = JWT.sign({
      role: 'admin',
    }, secretKey);
  })
})

test.beforeEach(t => {
  return Organization.remove({})
})

test('GET /echo responds with Echo!', async t => {
  t.plan(2);

  const options = {
    method: "GET",
    url: "/echo"
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200),
  t.is(response.result, 'Echo!');
});

test.serial('POST /organizations returns saved organization and saves to db', async t => {
  const org = {
    name: 'Org 1.0',
    description: 'An organization',
    url: 'http://organization.com',
    code: '123xyz',
    type: 'employer'
  } 
  
  const options = {
    method: "POST",
    url: "/organizations",
    payload: org,
    headers: {
      Authorization: token
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 201);
  t.deepEqual(response.result, org);

  const saved = await Organization.findOne({ code: org.code });
  t.is(saved.name, org.name);
  t.is(saved.description, org.description);
  t.is(saved.url, org.url);
  t.is(saved.code, org.code);
  t.is(saved.type, org.type);
});

test.serial('POST /organizations returns 401 if auth token is not present', async t => {
  const org = {
    name: 'Org 1.0',
    description: 'An organization',
    url: 'http://organization.com',
    code: '123xyz',
    type: 'employer'
  } 
  
  const options = {
    method: "POST",
    url: "/organizations",
    payload: org,
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 401);
});

test.serial('GET /organizations returns all saved organizations without code and url', async t => {
  await Organization.create(orgs)
  
  const options = {
    method: "GET",
    url: "/organizations"
  };

  t.plan(orgs.length * 6 + 3)
  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.result));
  t.is(response.result.length, 2);
  
  const results = response.result
  orgs.forEach(_org => {
    const org = results.find(result => result.name == _org.name)
    t.truthy(org)
    t.is(org.name, _org.name)
    t.is(org.description, _org.description)
    t.is(org.type, _org.type)
    t.false(org.hasOwnProperty('code'))
    t.false(org.hasOwnProperty('url'))
  })
});

test.serial('GET /organizations filtered by code return results with code and url', async t => {
  await Organization.create(orgs)
  
  const options = {
    method: "GET",
    url: "/organizations?code=123xyz"
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.result));
  t.is(response.result.length, 1);
  
  const results = response.result;
  const org = results[0];
  t.is(org.code, orgs[0].code);
  t.is(org.url, orgs[0].url);
  t.is(org.name, orgs[0].name);
  t.is(org.description, orgs[0].description);
  t.is(org.type, orgs[0].type);
});

test.serial('PUT /organizations updates saved organization', async t => {
  await Organization.create(orgs)

  const newOrg = Object.assign({}, orgs[0], {
    name: 'Super Duper'
  });
  
  const options = {
    method: "PUT",
    url: "/organizations",
    payload: newOrg,
    headers: {
      Authorization: token
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.deepEqual(response.result, newOrg);

  const saved = await Organization.findOne({ code: newOrg.code });
  t.is(saved.name, newOrg.name);
  t.is(saved.description, orgs[0].description);
  t.is(saved.url, orgs[0].url);
  t.is(saved.code, orgs[0].code);
  t.is(saved.type, orgs[0].type);
});

test.serial('PUT /organizations of not existent organization returns 404', async t => {
  const org = {
    name: 'Super Employer',
    description: 'An employer that is super',
    url: 'http://superemployer.com',
    code: 'invalidCode',
    type: 'employer'
  }
  
  const options = {
    method: "PUT",
    url: "/organizations",
    payload: org,
    headers: {
      Authorization: token
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 404);
});

test.serial('PUT /organizations returns 401 if auth token is not present', async t => {
  const org = {
    name: 'Super Employer',
    description: 'An employer that is super',
    url: 'http://superemployer.com',
    code: 'invalidCode',
    type: 'employer'
  }
  
  const options = {
    method: "PUT",
    url: "/organizations",
    payload: org,
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 401);
});


test.serial('DELETE /organizations/{code} deletes organization from db', async t => {
  await Organization.create(orgs)
 
  const options = {
    method: "DELETE",
    url: "/organizations/" + orgs[0].code,
    headers: {
      Authorization: token
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);

  const saved = await Organization.findOne({ code: orgs[0].code });
  t.falsy(saved);
});

test.serial('DELETE /organizations/{code} returns 401 if auth token is not present', async t => {
  await Organization.create(orgs)
 
  const options = {
    method: "DELETE",
    url: "/organizations/" + orgs[0].code,
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 401);
});