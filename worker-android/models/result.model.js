var mongoose = require('mongoose');

var ResultSchema = mongoose.Schema({
    execution_id: {
        type: String,
        required: true
    },
    file_id:{
        type:String
    },
    run_date: {
        type: Date,
        default: Date.now
    }
},
//Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
{
	timestamps: true
}
);

ResultSchema.virtual('id').get(function () {
    return this._id;
  });
  ResultSchema.set('toJSON', { getters: true, virtuals: true });
  ResultSchema.set('toObject', { getters: true });
var Result = module.exports = mongoose.model('Result', ResultSchema);
module.exports.get = function (callback, limit) {
    Result.find(callback).limit(limit);
}
