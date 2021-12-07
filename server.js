const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const port = 8080;
const MongoDB = require('mongodb').MongoDB;
const { MongoClient } = require('mongodb');

// Starten des Webservers
server.listen(port, function(){
    // Hinweis ausgeben, dass der Webserver läuft
    console.log('Webserber läuft und hört auf Port %d', port);
});

app.use(express.static(__dirname));

// Test
app.use(express.json());

app.get('/' , (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

/*
app.get('/mongoTest', (rep, res) => {
    res.sendFile('/mongoTest.html');
});
*/

app.post('/mongoUpload', (req, res) => {
    // Upload req.body to mongoDB 
});

async function main(){

    const uri = "mongodb+srv://webeng:ai21@cluster0.utsfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    try{
        await client.connect();

        await findLastPosts(client);

    }catch (e){
        console.error(e);
    }finally{
        await client.close();
    }
}

main().catch(console.error);

async function findLastPosts(client){
    const cursor = await client.db("WebPosts").collection("posts").find();
    const results = await cursor.toArray();
    if(results){
        console.log("Found results");
        console.log(results);
    }else{
        console.log("nope");
    }
}