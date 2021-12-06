
const { MongoClient } = require('mongodb');
var post_content="Test123";
var user_name="Test321";

async function main(){

    const uri = "mongodb+srv://webeng:ai21@cluster0.utsfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    try{
        await client.connect();

        await createPost(client,{User:user_name, post:post_content})

    }catch (e){
        console.error(e);
    }finally{
        await client.close();
    }
}

main().catch(console.error);

async function createPost(client, newListing){
    try{
        const result = await client.db("WebPosts").collection("posts").insertOne(newListing);
        console.log("The Message has been posted.");
    }catch (e){
        console.error(e);
    }

}