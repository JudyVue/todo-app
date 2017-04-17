'use strict';


const bcrypt = require('bcrypt');
const jwt = require('jswonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('todo:user');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  findHash: {type: String, unique: true },
});

userSchema.methods.generatePasswordHash = function(password){
  debug('generatePasswordHash');

  let saltRounds = 10;
  //docs say bcrypt can already return a promise, we'll see if this works
  bcrypt.hash(password, saltRounds)
  .then(hash => {
    this.password = hash;
    return this;
  })
  .catch(err => console.error(err));
};

userSchema.methods.comparePasswordHash = function(password){
  debug('comparePasswordHash');

  bcrypt.compare(password, this.password).then(res => {
    if(!res) return createError(401, 'wrong password');
    return this;
  })
  .catch(err => {
    console.error('bcrypt failed', err.message);
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');

  
}



module.exports = mongoose.model('user', userSchema);
