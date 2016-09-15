const mongoose = require('mongoose');
const Map = require('immutable').Map;

const Schema = mongoose.Schema;

const Organization = new Schema({
  name: String,
  description: String,
  url: String,
  code: String,
  type: { type: String, enum: ['employer', 'insurance', 'health system'] },
});

if (!Organization.options.toJSON) Organization.options.toJSON = {};
Organization.options.toJSON.transform = (doc, ret, options) => {
  const exclude = options.exclude || [];
  return new Map(ret)
    .delete('_id')
    .delete('__v')
    .filter((value, key) => exclude.indexOf(key) == -1)
    .toJS();
};

module.exports = mongoose.model('Organization', Organization);