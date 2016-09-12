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

if (!Organization.options.toObject) Organization.options.toObject = {};
Organization.options.toObject.transform = (doc, ret) => {
  return new Map(ret).delete('_id').delete('__v').toJS();
};

module.exports = mongoose.model('Organization', Organization);