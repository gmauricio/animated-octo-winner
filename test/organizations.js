import test from 'ava';
import server from '../server'

test('GET /echo responds with Echo!', t => {
    const options = {
        method: "GET",
        url: "/hello"
    };
 
    server.inject(options, response => {
        const result = response.result;
        t.is(response.statusCode, 200),
        t.is(result, 'Echo!');
    });
})

test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});
