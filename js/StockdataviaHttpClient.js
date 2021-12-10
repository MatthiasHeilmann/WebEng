//Function converts full JSON into list usable by chart.js
var datapoints=[[],[],[]];
            var alphabetize=[[],[],[]];

function convertdata(datensatz,index){
    let newdata=[];
    
    for(var x in datensatz["Weekly Adjusted Time Series"])
    {
        alphabetize[index].push(x)
    }
    alphabetize[index].sort();
    //console.log(alphabetize);
    for(let i=0;i<alphabetize[index].length;i++){
        newdata.push(datensatz["Weekly Adjusted Time Series"][alphabetize[index][i]]["5. adjusted close"])
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

//Instantiation of HttpClient & API Call RHO6.FRK=Roche, Max 5 calls per minute

var client = new HttpClient();
var StocksUrl1 = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=RHO6.FRK&apikey=61EK505FXBJ59YGC';
var StocksUrl2 = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=DAI.FRK&apikey=61EK505FXBJ59YGC';
var StocksUrl3 = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=FRE.FRK&apikey=61EK505FXBJ59YGC';

client.get(StocksUrl1, function(response) {
    var jsonfulldata = JSON.parse(response);
    //console.log(jsonfulldata)
    datapoints[0]= convertdata(jsonfulldata,0);

    client.get(StocksUrl2, function(response) {
        var jsonfulldata = JSON.parse(response);
        //console.log(jsonfulldata)
        datapoints[1]= convertdata(jsonfulldata,1);

        client.get(StocksUrl3, function(response) {
            var jsonfulldata = JSON.parse(response);
            //console.log(jsonfulldata)
            datapoints[2]= convertdata(jsonfulldata,2);
            //console.log(datapoints)


            //console.log(datapoints)
            //console.log(datapoints[0])
            //console.log(datapoints[1])
            //setTimeout(() => console.log(datapoints), 3000);

            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: alphabetize[0],
                    datasets:
                    [{
                        label: 'Stock Price of Roche Holding AG',
                        data: datapoints[0],
                        borderColor: 
                            'rgba(235, 27, 42, 0.8)',
                        hoverBorderColor:
                            'rgba(235, 27, 42, 0.3)',
                        tension: 0.1
                    },
                    {
                        label: 'Stock Price of Daimler AG',
                        data: datapoints[1],
                        borderColor: 
                            'rgba(100, 100, 100, 0.8)',
                        hoverBorderColor:
                            'rgba(100, 100, 100, 0.3)',
                        tension: 0.1
                    },
                    {
                        label: 'Stock Price of Fresenius SE & Co. KGaA',
                        data: datapoints[2],
                        borderColor: 
                            'rgba(200, 200, 200, 0.8)',
                        hoverBorderColor:
                            'rgba(200, 200, 200, 0.3)',
                        tension: 0.1
                    }
                    
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: datapoints[1].max
                        }
                        
                    }
                }
            });
            //console.log(myChart.data.datasets.data)
            });
});
});