'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = new express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/test', (req, res) => {
  const body = req.body.Body.toUpperCase();
  let response;

  switch(body) {
    case 'IN':
      console.info(`${req.body.From} responded with: ${req.body.Body.toUpperCase()}`);
      response = 'Thanks! See you then!';
      break;
    case 'OUT':
      console.info(`${req.body.From} responded with: ${req.body.Body.toUpperCase()}`);
      response = 'That\'s too bad! Maybe next time.';
      break;
    default:
      console.info(`Got an unrecognized response from ${req.body.From}`);
      response = 'Sorry, I didn\'t understand that. Please respond with IN or OUT.';
      break;
  }

  res.setHeader('Content-Type', 'text/plain');
  console.info('response:', response);
  res.status(200).send(response);
});

app.listen(process.env.PORT || 3030);
