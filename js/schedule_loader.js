var courseID;
const scheduleAPI = 'https://vorlesungsplan.dhbw-mannheim.de/ical.php';
// Complete with course id
var scheduleAPIParams = '?date=';

loadSchedule();

async function loadSchedule() {
    //The following backup URL was used before switching to a locally hosted proxy server
    //backup: var corsAPI = 'https://cors-anywhere.herokuapp.com/';  
    var corsAPI = 'http://localhost:8090/';
    // Temporär bis ne Liste aller dates existiert (uids werden aus einer Datenbank gelesen)
    var tempAPI = 'http://vorlesungsplan.dhbw-mannheim.de/ical.php?uid=8320001';

    var response = await fetch(corsAPI + tempAPI);

    var scheduleICS = await response.blob();

    var scheduleDiv = document.getElementById('termine');
    getScheduleTabel(await scheduleICS.text(), 0);
}

// Analyses the scheduleICS (as text) and returns HTML-Code that forms a table including the current weeks schedule
function getScheduleTabel(scheduleICS, offset) {
    // Gets the whole schedule information as a JSON array indexed by dates (YYYYMMDD)
    var scheduleContentJson;
    if (scheduleICS) {
        if (scheduleICS == sessionStorage.getItem("scheduleICS")) {
            scheduleContentJson = JSON.parse(sessionStorage.getItem("scheduleJson"));
        }
        else {
            scheduleContentJson = parseJSON(scheduleICS);
            sessionStorage.setItem("scheduleJson", JSON.stringify(scheduleContentJson));
            sessionStorage.setItem("scheduleICS", scheduleICS);
            sessionStorage.setItem("weekOffset", 0);
        }
    }
    else {
        scheduleContentJson = JSON.parse(sessionStorage.getItem("scheduleJson"));
    }

    var scheduleDiv = document.getElementById('termine');
    var theadTr = scheduleDiv.querySelector('thead').querySelector('tr');
    var tbody = scheduleDiv.querySelector('tbody');
    var weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    // Reset table
    theadTr.innerHTML = '';
    tbody.innerHTML = '';

    // Day to itterate over the weekdays with
    var iDay = new Date();
    // Set iDay to currents (or offsetted) weeks Monday
    iDay.setDate(iDay.getDate() - (iDay.getDay() - 1) + (offset * 7));
    console.log("Show schedule for week: " + iDay.toJSON().slice(0, 10))
    // locate the longest day
    var maxScheduleLength;
    for (var i = 0; i < 7; i++) {
        var currSchedule = scheduleContentJson[parseInt(iDay.toJSON().slice(0, 10).replace(/-/g, '')) + i];
        if (currSchedule)
            maxScheduleLength = Math.max(maxScheduleLength || 0, currSchedule.length);
    }

    for (var i = 0; i < 7; i++, iDay.setDate(iDay.getDate() + 1)) {
        // Get all scheduled lessons for the current day of the week
        var currSchedule = scheduleContentJson[iDay.toJSON().slice(0, 10).replace(/-/g, '')];
        // Only if the current day has any information
        if (currSchedule || (iDay.getDay() > 0 && iDay.getDay() < 6)) {
            // Inster header containing the current day ("day", DD.MM)
            var theadTh = document.createElement('th');
            theadTh.setAttribute('class', 'tg-ul38');
            theadTh.innerHTML += weekdays[iDay.getDay()] + ', ';
            theadTh.innerHTML += iDay.getDate() + '.' + (iDay.getMonth() + 1);
            theadTr.appendChild(theadTh);

            // Set body columns
            for (var j = 0; j < maxScheduleLength; j++) {
                var tbodyTr = document.getElementById('tr-' + j);
                if (tbodyTr == undefined) {
                    tbodyTr = document.createElement("tr");
                    tbodyTr.setAttribute('id', 'tr-' + j);
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

                var timeText = parseTime(currSchedule?.[j]?.time.begin) + "-" + parseTime(currSchedule?.[j]?.time.end);

                summary.innerHTML = currSchedule?.[j]?.summary || "";
                location.innerHTML = currSchedule?.[j]?.location || "";
                time.innerHTML = timeText === "-" ? "" : timeText;

                textWrapper.appendChild(summary);
                textWrapper.appendChild(location);
                textWrapper.appendChild(time);

                // TODO Maybe make it so the whole td is invisivle?
                tbodyTd.appendChild(textWrapper);
                tbodyTr.appendChild(tbodyTd);

            }
        }
    }

    document.getElementById('schedule-table').style.display = "";
    document.getElementById('loading-schedule').style.display = "none";
    document.getElementById('loading-schedule-loader').style.display = "none";
}

function offsetWeek(weekoffset) {
    if (weekoffset !== 0) {
        weekoffset = parseInt(sessionStorage.getItem("weekOffset")) + weekoffset;
        sessionStorage.setItem("weekOffset", weekoffset);
    }

    getScheduleTabel(null, weekoffset);
}

function setCourseID(id) {
    courseID = id;
}

function parseJSON(scheduleICS) {
    var scheduleLessons = {
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
    var scheduleLines = scheduleICS.match(/^.*([\n\r]+|$)/gm);
    var firstDate = true;
    var uid = '';
    var date = '';
    var beginTime = '';
    var endTime = '';
    var location = '';
    var summary = '';
    for (let i = 0; i < scheduleLines.length; i++) {
        var line = scheduleLines[i];
        if (line.includes('UID')) {
            if (!firstDate) {
                scheduleLessons[date].push({
                    'summary': summary,
                    'location': location,
                    'time': {
                        'begin': beginTime,
                        'end': endTime
                    }
                });
            }
            firstDate = false;
            uid = line.substring(line.indexOf(':') + 1).trim();
        }
        else if (line.includes('SUMMARY') && uid) { // value: summary
            summary = line.substring(line.indexOf(':') + 1).trim() || "";
        }
        else if (line.includes('DTSTART') && uid) { // value: YYYYMMDDThhmmss
            date = line.substring(line.indexOf(':') + 1).trim().split('T')[0];
            beginTime = line.substring(line.indexOf(':') + 1).trim().split('T')[1] || "";

            scheduleLessons[date] = scheduleLessons[date] || [];
        }
        else if (line.includes('DTEND') && uid) { // value: YYYYMMDDThhmmss
            endTime = line.substring(line.indexOf(':') + 1).trim().split('T')[1] || "";
        }
        else if (line.includes('LOCATION') && uid) { // value: (no specific )
            location = line.substring(line.indexOf(':') + 1).trim() || "";
        }
    }

    return scheduleLessons;
}

// Reads a time (hhmmss) and returns hh:mm or an empty string if time is undefined
function parseTime(timeText) {
    return timeText ? (timeText?.substring(0, 2) + ":" + timeText?.substring(2, 4)) : "";
}