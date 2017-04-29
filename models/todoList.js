'use strict';

console.log()
console.log(" *** ToDoList Model loaded *** ")
console.log()

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema

const todoSchema = Schema({
  listitem: {
    type       : String,
    validate   : {
      validator: (value) => {!/[^0-9a-zA-Z]+/.test(value)},
      msg      : 'List Item must be alphanumeric only'
    }
    required   : [true, 'List Item cannot be empty']
  },

  status: {
    type    : Boolean,
    default : false //defaulting to false to indicate task is still open
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID for list item cannot be empty']
  }
},
{
  timestamps: true
})

// - updateData parameters must be an object with atleast one of the table fields e.g., {'listitem': 'list item text'} or {'status': true} or {'listitem': 'list item text', 'status': true}
// - {new: true} will ensure that the query returns the updated object after successful completion
userSchema.statics.updateItem = function(value, updateData){
  return this.findOneAndUpdate({'_id': ObjectId(value)}, {$set: updateData}, {new: true})
}

module.exports = mongoose.model('todoList', todoSchema);
