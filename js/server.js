const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const port = 8080;
const MongoDB = require('mongodb').MongoDB;

// Starten des Webservers
server.listen(port, function(){
    // Hinweis ausgeben, dass der Webserver läuft
    console.log('Webserber läuft und hört auf Port %d', port);
});

app.use(express.static(__dirname));

// Test
app.use(express.json());

app.get('/' , (req, res) => {
    res.sendFile('/scedule.html');
});

app.get('/mongoTest', (rep, res) => {
    res.sendFile('/mongoTest.html');
});

app.post('/mongoUpload', (req, res) => {
    // Upload req.body to mongoDB 
});