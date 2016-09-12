const server = require('./src/server');

server.register({
  register: require('hapi-mongoose-db-connector'),
  options: {
    mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/organizations-api'
  }
}, (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
