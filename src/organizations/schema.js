const Joi = require('joi');

module.exports = {
  name: Joi.string()
    .required()
    .description('the name of the organization'),
  description: Joi.string().required()
    .description('the description of the organization'),
  url: Joi.string().required()
    .description('the url of the organization'),
  code: Joi.string().required()
    .description('the code of the organization'),
  type: Joi.string().required()
    .valid(['employer', 'insurance', 'health system'])
    .description('the type of the organization (employer, insurance, health system)'),
};