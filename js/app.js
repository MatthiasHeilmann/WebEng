var courseID;
const sceduleAPI = "https://vorlesungsplan.dhbw-mannheim.de/ical.php";
// Complete with course id
var sceduleAPIParams = "?uid=";

async function loadScedule(){
    // temporär bis man den scheiß mit Cors gefixt hat. 
    // Schaltet ne CORS-Anywhere Demo als Origin für den API aufruf zwischen
    var corsAPI = "https://cors-anywhere.herokuapp.com/";   
    // Temporär bis ne Liste aller UIDs existiert
    var tempAPI = "http://vorlesungsplan.dhbw-mannheim.de/ical.php?uid=8320001"; 

    var response = await fetch(corsAPI + tempAPI);

    var sceduleICS = await response.blob();

    console.log(sceduleICS);

    var sceduleDiv = document.getElementById("scedule-container");
    sceduleDiv.innerHTML = getSceduleTabel;
}

// Analyses the sceduleICS (as text) and returns HTML-Code that forms a table including the current weeks scedule
async function getSceduleTabel(sceduleICS){
    //return "Display table content here";
    return JSON.stringify(parseJSON(await sceduleICS.text()), null, "<br>");
}

function setCourseID(id){
    courseID = id;
}

function parseJSON(sceduleICS){
    var sceduleLessons = {
        //["uids"]: {
        //    "name": name,
        //    "dates": []
        //}
    };
    // Splis ics by line terminators
    var sceduleLines = sceduleICS.match(/^.*([\n\r]+|$)/gm);;
    var uid;
    var uidObj = {summary: "summary", dates: []};
    for(let i = 0; i < sceduleLines.length; i++){
        var line = sceduleLines[i];
        if(line.includes("UID")){
            sceduleLessons[uid] = uidObj;
            uid = line.split(":")[1];
            uidObj = {summary: "summary", dates: []};
        }
        else if(line.includes("SUMMARY") && uid){
            var currentSummary = line.split(":")[1];
            uidObj.summary = currentSummary;
        }
        else if(line.includes("DTSTART") && uid){
            uidObj.dates.push(line.split(":")[1]);
        }
    }

    return sceduleLessons;
}