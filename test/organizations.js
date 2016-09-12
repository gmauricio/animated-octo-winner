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