'use strict';



//npm modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('todo: server');

const MONGODB_URI='mongodb://localhost:todo';

const app = express();

mongoose.connect(MONGODB_URI);

const PORT = 4000;
app.listen(PORT, () => {
  debug('server up on', PORT);
});
