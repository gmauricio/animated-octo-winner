# hapi-organizations

Hapi Organizations Sample API

This is a sample application build with [Hapi] (http://hapijs.com/) framework.
There is a demo deployed to Heroku at https://dry-escarpment-49344.herokuapp.com.

### Features

- Get, create, update and delete Organization resource, where Organizations have the following properties:
  * name
  * description
  * url
  * code
  * type: [employer, insurance, health system]
- Allow clients to filter results on the GET request method for the following properties: `name` or `code`
- By default do not return the value of `code` or `url` on the GET request method unless the `code` property has been passed as a parameter
  
Check [https://dry-escarpment-49344.herokuapp.com/documentation](https://dry-escarpment-49344.herokuapp.com/documentation) for API demo and documentation

### Advanced features

- [JWT authentication] (https://jwt.io/introduction/)
- Versioning support
- Search using Elastic Search
- Swagger generated documentation

### Some techonologies and libraries used

- JWT for authentication
- MongoDB, with mongoose, to store data.
- Elastic Search, for text searches.
- Swagger, To generate docs
- Ava, for testing.

