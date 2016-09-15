const Joi = require('joi');

module.exports = {
  name: Joi.string()
    .required()
    .description('the name of the organization')
    .example('An organization with a name'),
  description: Joi.string().required()
    .description('the description of the organization')
    .example('An organization that is described with words'),
  url: Joi.string().required()
    .description('the url of the organization')
    .example('http://superOrg.org'),
  code: Joi.string().required()
    .description('the code of the organization')
    .example('xyz'),
  type: Joi.string().required()
    .valid(['employer', 'insurance', 'health system'])
    .description('the type of the organization (employer, insurance, health system)')
    .example('employer'),
};