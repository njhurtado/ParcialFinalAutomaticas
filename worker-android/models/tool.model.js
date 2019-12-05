const mongoose = require('mongoose');

const ToolSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    version: String,
    app_type: String,
	test_id: {
        type: String
    },
},
//Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
{
	timestamps: true
});

ToolSchema.virtual('id').get(function () {
    return this._id;
  });
  ToolSchema.set('toJSON', { getters: true, virtuals: true });
  ToolSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Tool', ToolSchema);