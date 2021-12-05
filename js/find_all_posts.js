
const { MongoClient } = require('mongodb');

async function main(){

    const uri = "mongodb+srv://webeng:ai21@cluster0.utsfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    try{
        await client.connect();
        await findLastPosts(client);

    }
    catch (e){console.error(e);}
    finally{
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