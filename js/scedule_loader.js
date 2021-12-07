var courseID;
const sceduleAPI = 'https://vorlesungsplan.dhbw-mannheim.de/ical.php';
// Complete with course id
var sceduleAPIParams = '?date=';

loadScedule();

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

async function loadScedule(){
    // temporär bis man den scheiß mit Cors gefixt hat. 
    // Schaltet ne CORS-Anywhere Demo als Origin für den API aufruf zwischen
    var corsAPI = 'https://cors-anywhere.herokuapp.com/';   
    // Temporär bis ne Liste aller dates existiert (uids werden aus einer Datenbank gelesen)
    var tempAPI = 'http://vorlesungsplan.dhbw-mannheim.de/ical.php?uid=8320001'; 

    var response = await fetch(corsAPI + tempAPI);

    var sceduleICS = await response.blob();

    var sceduleDiv = document.getElementById('termine');
    getSceduleTabel(await sceduleICS.text(), 0);
}

// Analyses the sceduleICS (as text) and returns HTML-Code that forms a table including the current weeks scedule
function getSceduleTabel(sceduleICS, offset){
    // Gets the whole scedule information as a JSON array indexed by dates (YYYYMMDD)
    var sceduleContentJson;
    if(sceduleICS){
        sceduleContentJson = parseJSON(sceduleICS);
        sessionStorage.setItem("sceduleJson", JSON.stringify(sceduleContentJson));
        sessionStorage.setItem("weekOffset", 0);
    }
    else{
        sceduleContentJson = JSON.parse(sessionStorage.getItem("sceduleJson"));
    }

    var sceduleDiv = document.getElementById('termine');
    var theadTr = sceduleDiv.querySelector('thead').querySelector('tr');
    var tbody = sceduleDiv.querySelector('tbody');
    var weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    // Reset table
    theadTr.innerHTML = '';
    tbody.innerHTML = '';

    // Day to itterate over the weekdays with
    var iDay = new Date();
    // Set iDay to currents (or offsetted) weeks Monday
    iDay.setDate(iDay.getDate() - (iDay.getDay()-1) + (offset *7));
    console.log("Show scedule for week: " + iDay.toJSON().slice(0,10))
    // locate the longest day
    var maxSceduleLength;
    for(var i = 0; i < 7; i++){
        var currScedule = sceduleContentJson[parseInt(iDay.toJSON().slice(0,10).replace(/-/g,'')) +i];
        if(currScedule)
        maxSceduleLength = Math.max(maxSceduleLength||0, currScedule.length);
    }
    
    for(var i = 0; i < 7; i++, iDay.setDate(iDay.getDate() +1)){
        // Get all sceduled lessons for the current day of the week
        var currScedule = sceduleContentJson[iDay.toJSON().slice(0,10).replace(/-/g,'')];
        // Only if the current day has any information
        if(currScedule || (iDay.getDay() > 0 && iDay.getDay() < 6)){
            // Inster header containing the current day ("day", DD.MM)
            var theadTh = document.createElement('th');
            theadTh.setAttribute('class', 'tg-ul38');
            theadTh.innerHTML += weekdays[iDay.getDay()] + ', ';
            theadTh.innerHTML += iDay.getDate() + '.' + (iDay.getMonth() +1);
            theadTr.appendChild(theadTh);

            // Set body columns
            for(var j = 0; j < maxSceduleLength; j++){
                var tbodyTr = document.getElementById('tr-'+j);
                if(tbodyTr == undefined){
                    tbodyTr = document.createElement("tr");
                    tbodyTr.setAttribute('id', 'tr-' +j);
                    tbody.appendChild(tbodyTr);
                }
                
                var tbodyTd = document.createElement('td');
                // Get relevant information of current lesson
                var textWrapper = document.createElement('div');
                var summary = document.createElement('span');
                var location = document.createElement('span');
                var time = document.createElement('span');

                tbodyTd.setAttribute('class', 'tg-0lax');
                textWrapper.setAttribute('class', 'text-wrap');
                summary.setAttribute('class', 'lesson-summary');
                location.setAttribute('class', 'lesson-location');
                time.setAttribute('class', 'lesson-time');

                var timeText = parseTime(currScedule?.[j]?.time.begin) + "-" + parseTime(currScedule?.[j]?.time.end);

                summary.innerHTML = currScedule?.[j]?.summary || "";
                location.innerHTML = currScedule?.[j]?.location || "";
                time.innerHTML = timeText === "-"? "" : timeText;
                
                textWrapper.appendChild(summary);
                textWrapper.appendChild(location);
                textWrapper.appendChild(time);

                // TODO Maybe make it so the whole td is invisivle?
                tbodyTd.appendChild(textWrapper);
                tbodyTr.appendChild(tbodyTd);
                
            }
        }
    }

    document.getElementById('scedule-table').style.display="";
    document.getElementById('loading-scedule').style.display="none";
    document.getElementById('loading-scedule-loader').style.display="none";
}

function offsetWeek(weekoffset){
    if(weekoffset !== 0){
        weekoffset = parseInt(sessionStorage.getItem("weekOffset")) + weekoffset;
        sessionStorage.setItem("weekOffset", weekoffset);
    }

    getSceduleTabel(null, weekoffset);
}

function setCourseID(id){
    courseID = id;
}

function parseJSON(sceduleICS){
    var sceduleLessons = {
        //['dates']: {
        //  ['uid']: {
        //      summary: 'summary'
        //      time: {
        //              begin: 'hhmmss'
        //              end: 'hhmmss'
        //          }
        //      location: 'location'
        //  }
        //}
    };
    var sceduleLines = sceduleICS.match(/^.*([\n\r]+|$)/gm);
    var firstDate = true;
    var uid = '';
    var date = '';
    var beginTime = '';
    var endTime = '';
    var location = '';
    var summary = '';
    for(let i = 0; i < sceduleLines.length; i++){
        var line = sceduleLines[i];
        if(line.includes('UID')){
            if(!firstDate){
                sceduleLessons[date].push({
                    'summary' : summary,
                    'location': location,
                    'time': {
                        'begin': beginTime,
                        'end': endTime
                    }
                });
            }
            firstDate = false;
            uid = line.substring(line.indexOf(':')+1).trim();
        }
        else if(line.includes('SUMMARY') && uid){ // value: summary
            summary = line.substring(line.indexOf(':')+1).trim() || "";
        }
        else if(line.includes('DTSTART') && uid){ // value: YYYYMMDDThhmmss
            date = line.substring(line.indexOf(':')+1).trim().split('T')[0];
            beginTime = line.substring(line.indexOf(':')+1).trim().split('T')[1] || "";

            sceduleLessons[date] = sceduleLessons [date] || [];
        }
        else if(line.includes('DTEND') && uid){ // value: YYYYMMDDThhmmss
            endTime = line.substring(line.indexOf(':')+1).trim().split('T')[1] || "";
        }
        else if(line.includes('LOCATION') && uid){ // value: (no specific )
            location = line.substring(line.indexOf(':')+1).trim() || "";
        }
    }

    return sceduleLessons;
}

// Reads a time (hhmmss) and returns hh:mm or an empty string if time is undefined
function parseTime(timeText){
    return timeText? (timeText?.substring(0, 2) + ":" + timeText?.substring(2, 4)) : "";
}