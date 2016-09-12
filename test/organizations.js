import test from 'ava';
import server from '../src/server'
import mongoose from 'mongoose';
import Organization from '../src/models/organization';

test.before(t => {
  return server.register({
    register: require('hapi-mongoose-db-connector'),
    options: {
      mongodbUrl: 'mongodb://localhost:27017/organizations-api-test'
    }
  }).then(() => Organization.remove({}))
})

test.afterEach.always(t => {
  return Organization.remove({})
});

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

test('POST /organizations returns saved organization and saves to db', async t => {
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
    payload: org 
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

test('GET /organizations returns all saved organizations', async t => {
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

  await Organization.create(orgs)
  
  const options = {
    method: "GET",
    url: "/organizations"
  };

  t.plan(orgs.length * 6 + 3)
  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.true(Array.isArray(response.result));
  t.is(response.result.length, 2)
  
  const results = response.result
  orgs.forEach(_org => {
    const org = results.find(result => result.name == _org.name)
    t.truthy(org)
    t.is(org.name, _org.name)
    t.is(org.description, _org.description)
    t.is(org.type, _org.type)
  })
});