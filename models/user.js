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

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      //if there is an error with bcrypt, reject it and show bcrypt's error
      if (err) return reject(err);

      //otherwise, set the password property to the hash and resolve with the instantiated user (this)
      this.password = hash;
      resolve(this);
    });
  });
};


module.exports = mongoose.model('user', userSchema);
