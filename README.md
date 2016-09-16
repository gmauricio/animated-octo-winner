# hapi-organizations

Hapi Organizations Sample API

This is a sample application build with [Hapi] (http://hapijs.com/) framework.
There is a demo deployed to Heroku at https://hapi-organizations.herokuapp.com.

## Features

- Get, create, update and delete Organization resource, where Organizations have the following properties:
  * name (used as an identifer for the organization, when doing and update or delete)
  * description
  * url
  * code
  * type: [employer, insurance, health system]
- Allow clients to filter results on the GET request method for the following properties: `name` or `code`
- By default do not return the value of `code` or `url` on the GET request method unless the `code` property has been passed as a parameter
  
Check [https://hapi-organizations.herokuapp.com/documentation](https://hapi-organizations.herokuapp.com/documentation) for API demo and documentation

## Advanced features

- [JWT authentication] (https://jwt.io/introduction/)
- Versioning support
- Search using Elastic Search
- Swagger generated documentation
- Caching layer with Redis

## Some techonologies and libraries used

- JWT for authentication
- MongoDB, with mongoose, to store data.
- Elastic Search, for text searches.
- Swagger, To generate docs
- Ava, for testing.
- Redis to cache searches

## Architecture

All logic is divided into Hapi plugins, there are 3 plugins:

- organizations: API to manage Organization resources.
- auth: auth API and authentication logic with JWT
- search: handles connection and queries to elastic search

Each plugin is contained within is own folder.

### Some implementation details

#### Organizations plugin

The folder for this plugin contains the following files:

- index.js: Entrypoint for plugin
- handlers.js: Exports handlers for each route implemented by the plugin, analog to a controller in other framework, which should be really thin, and delegate logic to services.
- model.js: Implements the Db model to represent database organizations collection and document schema.
- scheme.js: Joi scheme to represent and validate organizations, for payloads ans responses.
- service.js: Implements Organization business logic, as finding, creating and updating resources.  

#### Authentication with JWT

Creating, updating and deleting organizations operations are secured.

There are two services associated with authentication, to get a token and to check the token:

- POST /auth with credentials to obtain a token
- GET /auth/me with a token in the Authorization header to check authentication and get user information

#### Versioning

There is only one default version for all services, but there is an additional status service to show how versioning works

- GET /status with no header to check whats the current default version
- GET /status providing a version in the header to see how it detects the version. (i.e `Accept: 'application/vnd.organizations.v2+json'`)

check [test/status.js](https://github.com/gmauricio/hapi-organizations/blob/master/test/status.js) for more details

#### Search

Search works when trying to get organizations filtered by name. 

Example: GET /organizations?name=part%20of%20name 

#### Caching

Hapi catbox was used to implement caching with Redis. Only one route works with cache:

GET /organizations

The query params are used to generate the cache object key.

## Testing

For testing and develoment you need the following:

- Elasticsearch running on http://localhost:9200
- MongoDb running on localhost:27017
- Redis running on 127.0.0.1:6379

Or set the following env variables

- BONSAI_URL with elasticache url
- REDIS_URL with redis connection url
- MONGODB_URI with mongodb connection url
