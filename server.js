'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const WebSocket = require('websocket');

var http = require('http');
var server = http.createServer(function(request, response) {
  response.writeHead(404);
  response.end();
});
server.listen(8080);

const app = new express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const ws = new WebSocket.server({
  httpServer: server
});

const connections = new Set();

ws.on('request', (req) => {
  const conn = req.accept();
  connections.add(conn);

  conn.on('close', () => {
    connections.delete(conn);
  });
});

function notifyClients(from, status) {
  connections.forEach(conn => {
    conn.sendUTF(JSON.stringify({ from, status }));
  });
}

app.post('/test', (req, res) => {
  const body = req.body.Body.toUpperCase();
  let response;

  switch(body) {
    case 'IN':
      console.info(`${req.body.From} responded with: ${req.body.Body.toUpperCase()}`);
      notifyClients(req.body.From, 'in');
      response = 'Thanks! See you then!';
      break;
    case 'OUT':
      console.info(`${req.body.From} responded with: ${req.body.Body.toUpperCase()}`);
      notifyClients(req.body.From, 'out');
      response = 'That\'s too bad! Maybe next time.';
      break;
    default:
      console.info(`Got an unrecognized response from ${req.body.From}`);
      notifyClients(req.body.From);
      response = 'Sorry, I didn\'t understand that. Please respond with IN or OUT.';
      break;
  }

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(response);
});

app.listen(process.env.PORT || 80);
