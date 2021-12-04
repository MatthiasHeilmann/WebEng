//Function converts full JSON into list usable by chart.js

function convertdata(datensatz){
    let newdata=[];
    
    for(var x in datensatz["Weekly Adjusted Time Series"])
    {
        alphabetize.push(x)
    }
    alphabetize.sort();
    //console.log(alphabetize);
    for(let i=0;i</*datensatz.length()*/1100;i++){
        newdata.push(datensatz["Weekly Adjusted Time Series"][alphabetize[i]]["2. high"])
    }
    //console.log(newdata);
    return newdata
}

//Definition of HttpClient

var HttpClient = function() {
    this.get = function(request, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() { 
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
                callback(httpRequest.responseText);
        }
        httpRequest.open("GET", request, true);
        httpRequest.send(null);
    }
}

//Instantiation of HttpClient & API Call

var client = new HttpClient();
var StocksUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=IBM&apikey=demo';
client.get(StocksUrl, function(response) {
    var jsonfulldata = JSON.parse(response);
    //console.log(jsonfulldata)
    datapoints= convertdata(jsonfulldata);
    //console.log(datapoints)


    //console.log(datapoints)
    //setTimeout(() => console.log(datapoints), 3000);

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: alphabetize,
            datasets: [{
                label: 'Stock Price',
                data: datapoints,
                borderColor: 
                    'rgba(235, 27, 42, 0.2)',
                hoverBorderColor:
                    'rgba(235, 27, 42, 0.6)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max:250
                }
                
            }
        }
    });
    //console.log(myChart.data.datasets.data)
    });
