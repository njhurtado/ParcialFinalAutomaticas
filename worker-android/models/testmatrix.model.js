var mongoose = require('mongoose');

var TestMatrixSchema = mongoose.Schema({    
    test_id: {
        type: String
    },
    aplication_id: {
        type: String,
        required: true
    },
    version_id: {
        type: String,
        required: true
    },
	tool_id: {
        type: String,
        required: true
    },  
    tests_list: {
        type: Array
    }, 
    app_type: {
        type: String
    },
    test_type: {
        type: String
    },
    test_mode: {
        type: String
    },
    mutation: {
        type: String
    },
    mutation_value: {
        type: Array
    },
    tool_type: {
        type: String
    },
    tool_size: {
        type: String
    },
    tool_version: {
        type: String
    },
    random_events: {
        type: Number
    },
    random_seed: {
        type: String
    }
},
//Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
{
	timestamps: true
});
    TestMatrixSchema.virtual('id').get(function () {
    return this._id;
  });
  TestMatrixSchema.set('toJSON', { getters: true, virtuals: true });
  TestMatrixSchema.set('toObject', { getters: true });

var TestMatrix = module.exports = mongoose.model('TestMatrix', TestMatrixSchema);

module.exports.get = function (callback, limit) {
    TestMatrix.find(callback).limit(limit);
}

var TestMatrixModel = {    test_id: null,
    aplication_id: null,
    version_id: null,
	tool_id: null,  
    tests_list: null, 
    app_type: null,
    test_type: null,
    test_mode: null,
    mutation: null,
    mutation_value: null,
    tool_type: null,
    tool_size: null,
    tool_version: null,
    random_events: null,
    random_seed: null }

    module.exports.mapEntityMatrixModel= function (object){
var objArr=Object.keys(TestMatrixModel);
//console.log(objArr);
for(let key of objArr){       
    //var value=Object.keys(i).map(key => i[key]);   
    if(object[key]){
        TestMatrixModel[key]= object[key];
    }
    /*f(value)
    query[Object.keys(i)]=new RegExp(value);*/
}

//console.log(TestMatrixModel);
return TestMatrixModel;
}


