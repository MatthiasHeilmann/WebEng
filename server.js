const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

app.get('/' , (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/mongoGet',async (req, res) => {
    res.json(await findPosts());
});

app.post('/mongoPost', (req, res) => {
    console.log("Got: " + JSON.stringify(req.body));
    sendPost(JSON.stringify(req.body));
});

async function sendPost(post){

    const uri = "mongodb+srv://webeng:ai21@cluster0.utsfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    try{
        await client.connect();
    
        await createPost(client,post)

    }catch (e){
        console.error(e);
    }finally{
        await client.close();
    }
}

async function createPost(client, newListing){
    try{
        const result = await client.db("WebPosts").collection("posts").insertOne(JSON.parse(newListing));
        console.log("The Message has been posted: " + resulst);
    }catch (e){
        console.error(e);
    }

}

async function findPosts(){
    
    const uri = "mongodb+srv://webeng:ai21@cluster0.utsfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    
    const client = new MongoClient(uri);
    var retPosts = {"data": []};
    try{
        await client.connect();

        retPosts["data"] = await findAllPosts(client);
    }catch (e){
        console.error(e);
    }finally{
        await client.close();
    }

    return retPosts;
}


async function findAllPosts(client){
    const cursor = await client.db("WebPosts").collection("posts").find();
    const results = await cursor.toArray();
    if(results){
        console.log("Found results");
        return results;
    }else{
        console.log("nope");
        return null;
    }
}