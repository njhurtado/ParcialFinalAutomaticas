const mongoose = require('mongoose');

const ParamSchema = mongoose.Schema({
    param: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    test_id: String,
},
//Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
{
	timestamps: true
});
ParamSchema.virtual('id').get(function () {
    return this._id;
  });
  ParamSchema.set('toJSON', { getters: true, virtuals: true });
  ParamSchema.set('toObject', { getters: true });


module.exports = mongoose.model('Param', ParamSchema);