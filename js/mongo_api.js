async function uploadToMongo(){
    var name = document.getElementById('name-input').value;
    var data = document.getElementById('blackboard').value;
    var jsonData = {name, data};
    console.log(`Sending: name:${name}, data:${data}`);

    if(data === "" || name===""){
        alert("Invalid data");
        return;
    }

    const response = await fetch('/mongoPost', {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(jsonData)
    }); 
    
}

async function loadFromMongo(){
    console.log("Fetching mogno: ");
    var res = await fetch('/mongoGet');
    console.log(await res.json());
    console.log("Fetching done: ");
}