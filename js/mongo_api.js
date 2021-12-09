async function uploadToMongo(){
    var data = document.getElementById('blackboard').value;
    console.log("Sending: " + data);
    
    const response = await fetch('/mongoPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        json: JSON.parse(data)
    }); 
    
}

async function loadFromMongo(){
    console.log("Fetching mogno: ");
    var res = await fetch('/mongoGet');
    console.log(await res.json());
    console.log("Fetching done: ");
}