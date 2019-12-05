const mongoose = require('mongoose');
const Application = require('../models/application.model.js');
const VersionSchema = mongoose.Schema({
    version: {
        type: String,
        required: true
    },
    aplication_id: {
        type: String,
        required: true
    },
	url_repo: String,
    url_app: String
    },
    //Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
    {
        timestamps: true
    });
    VersionSchema.virtual('id').get(function () {
        return this._id;
      });
    VersionSchema.virtual('app', {
            ref: 'Application', // The model to use
            localField: 'aplication_id', // Find people where `localField`
            foreignField: '_id', // is equal to `foreignField`
            justOne: true // And only get the number of docs
      });
      VersionSchema.set('toJSON', { getters: true, virtuals: true });
      VersionSchema.set('toObject', { getters: true })
module.exports = mongoose.model('Version', VersionSchema);