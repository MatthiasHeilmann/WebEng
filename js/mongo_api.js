var oldlength;

async function uploadToMongo(){
    var name = document.getElementById('name-input').value;
    var data = document.getElementById('blackboard').value;
    
    document.getElementById("blackboard").value='';
    document.getElementById("name-input").value='';
    $('#chars').text("1000");
    $('#chars-name').text("30");

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
    
    var res2length=res2.data.length;
    oldlength=res2length;
    for(var i=res2length-1;i>=0;i--){
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

async function refresh_board(){
    console.log("refreshing board...");
    
    console.log("Fetching mongo: ");
    var res = await fetch('/mongoGet');
    var res2 = await res.json();
    console.log(res2);
    console.log("Fetching done: ");

    var res2length=res2.data.length;
    for(var i=res2length-1;i>=oldlength;i--){
        let div = document.createElement('div');
        div.classList.add('bubble');
        div.classList.add('bubble-bottom-left');
        let text = (res2.data[i].post || res2.data[i].data);
        div.innerHTML=text+"</br>";
        let cite = document.createElement('cite');
        cite.innerHTML ="- "+ (res2.data[i].User || res2.data[i].name);
        div.append(cite);

        document.getElementById("scroll-id").prepend(div);
    }
    oldlength=res2length;
}