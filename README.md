# hapi-organizations

Hapi Organizations Sample API

This is a sample application build with [Hapi] (http://hapijs.com/) framework.
There is a demo deployed to Heroku at https://hapi-organizations.herokuapp.com.

## Features

- Get, create, update and delete Organization resource, where Organizations have the following properties:
  * name
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

## Some techonologies and libraries used

- JWT for authentication
- MongoDB, with mongoose, to store data.
- Elastic Search, for text searches.
- Swagger, To generate docs
- Ava, for testing.

## Archictecture

All logic is divided into Hapi plugins, there are 3 plugins:

- organizations: API to manage Organization resources.
- auth: auth API and authentication logic with JWT
- search: handles connection and queries to elastic search

## Testing

For testing and develoment you need the following:

- Elasticsearch running on http://localhost:9200
- MongoDb running on localhost:27017
- Redis running on 127.0.0.1:6379

Or set the following env variables

- BONSAI_URL with elasticache url
- REDIS_URL with redis connection url
- MONGODB_URI with mongodb connection url