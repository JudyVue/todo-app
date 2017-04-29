'use strict';

console.log()
console.log(" *** User's Model loaded *** ")
console.log()

const bcrypt   = require('bcrypt'),
      mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

function validatePwd(value){
  // Only alphabets, numbers and special characters (!@#$%)
  if (/[^0-9a-zA-Z\!\@\#\$\%]/.test(value)){ return false }

  // Atleast 1 uppercase character
  if (!/[A-Z]/.test(value)){ return false }

  // Atleast 1 lowercase character
  if (!/[a-z]/.test(value)){ return false }

  // Atleast 1 number
  if (!/[0-9]/.test(value)){ return false }

  // Atlest 1 special character
  if (!/[\!\@\#\$\%]/.test(value)){ return false }

  // If all tests pass
  return true
}


const userSchema = Schema({
  username: {
    type: String,
    minlength: [3, 'User Name must have atleast 3 characters'],
    validate : {
      validator: (value) => {!/[^0-9a-zA-Z]+/.test(value)},
      msg      : 'User Name must be alphanumeric only'
    }
    required: [true, 'User Name cannot be empty'],
    unique: [true, 'User Name already taken']
  },

  password: {
    type: String,
    minlength: [8, 'Password must be atleast 8 characters long'],
    validate : {
      validator: validatePwd,
      msg      : 'Password should have atleast 1 of the following: Uppercase, Lowercase, Number and Special Character (!@#$%)'
    }
    required: [true, 'Password cannot be empty']
  },

  todoitems: [{type: Schema.Types.ObjectId, ref: 'todoList'}]
});

// convert the password into a hash before saving it into the DB
userSchema.pre('save', function(next){
  let user = this //save the context for shring with callback

  bcrypt.hash(user.password, 10, function(hasherr, hash){
    if (hasherr){
      return next(hasherr)
    } else {
      user.password = hash
      return next()
    }
  })
})

// bcrypt.compare returns a 'true' or 'false' as the valid response.
userSchema.methods.comparePasswordHash = function(password, cb){
  bcrypt.compare(password, this.password, function(err, resp){
    if (err){
      cb(err, '')
    } else if (!resp){
      cb('Password Mismatch', '')
    } else {
      cb('', resp)
    }
  })
}

// this is used to get the username/pwd details at login
userSchema.statics.findUser = function(value){
  return this.find({'username': value})
}

// this is used to get the user details and related todo items after user passes login
userSchema.statics.getUserItems = function(value){
  return this.find({'username': value}).populate('todoitems')
}


module.exports = mongoose.model('user', userSchema);
