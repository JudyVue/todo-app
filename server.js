'use strict';

const express = require('express');
const PORT = 4000;
const app = express();



app.listen(PORT, () => {
  console.log('server up on', PORT);
});
