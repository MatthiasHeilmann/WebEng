async function uploadToMongo(){
    var name = document.getElementById('name-input').value;
    var data = document.getElementById('blackboard').value;
    
    document.getElementById("blackboard").value='';
    document.getElementById("name-input").value='';
    document.getElementById("chars").value='';

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

loadFromMongo();

async function loadFromMongo(){
    
    console.log("Fetching mongo: ");
    var res = await fetch('/mongoGet');
    var res2 = await res.json();
    console.log(res2);
    console.log("Fetching done: ");
    
    for(var i=0;i<res2.data.length;i++){
        let div = document.createElement('div');
        div.classList.add('bubble');
        div.classList.add('bubble-bottom-left');
        let text = (res2.data[i].post || res2.data[i].data);
        div.innerHTML=text+"</br>";
        let cite = document.createElement('cite');
        cite.innerHTML ="- "+ (res2.data[i].User || res2.data[i].name);
        div.appendChild(cite);

        document.getElementById("scroll-id").appendChild(div);
    }
    document.getElementById("loading-blackboard-loader").style.display="none";
}

function refresh_board(){
    console.log("refreshing board...");
    loadFromMongo();
}