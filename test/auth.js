import Hapi from 'hapi';
import test from 'ava';

const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: 8000 
});

test.before(t => {
  return server.register([
    { register: require('../src/auth') }
  ])
})

test('POST /auth with invalid credentials returns 400', async t => {
  const options = {
    method: "POST",
    url: "/auth",
    payload: {
      username: 'admin',
      password: 'wrong_pass'
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 400);
});


test('POST /auth with valid credentials returns token', async t => {
  const options = {
    method: "POST",
    url: "/auth",
    payload: {
      username: 'admin',
      password: 'p4ssw0rd'
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.is(response.result.token.length, 160);
});

test('GET /auth/me without auth token returns 401', async t => {
  const options = {
    method: "GET",
    url: "/auth/me"
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 401);
});

test('GET /auth/me with invalid token returns 401', async t => {
  const options = {
    method: "GET",
    url: "/auth/me",
    headers: {
      Authorization: 'theInvalidToken'
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 401);
});

test('GET /auth/me with valid token returns user info', async t => {
  const authResponse = await server.inject({
    method: "POST",
    url: "/auth",
    payload: {
      username: 'admin',
      password: 'p4ssw0rd'
    }
  });

  const options = {
    method: "GET",
    url: "/auth/me",
    headers: {
      Authorization: authResponse.result.token
    }
  };

  const response = await server.inject(options);
  t.is(response.statusCode, 200);
  t.is(response.result.id, 1);
  t.is(response.result.role, 'admin');
  t.is(response.result.username, 'admin');
});
