new function() {
    var ws = null;
    
    var connectButton;
    var disconnectButton; 

    var open = function() {
        var host = window.location.hostname;
        ws = new WebSocket("ws://" +host  + ":9000/notifications");
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;
    }
    
    var close = function() {
        if (ws) {
            console.log('CLOSING ...');
            ws.close();
        }
    }
    
    var onOpen = function() {
        console.log('OPENED:');
    };
    
    var onClose = function() {
        console.log('CLOSED:');
        ws = null;
    };

    function getDewPoint(pressure, temperature) {
        var b = 237.7;
        var a = 17.27;
        var gamma = (a * temperature) / (b + temperature) + Math.log(pressure / 100);
        return (b * gamma) / (a - gamma);
    }

    var onMessage = function(event) {

        var data = JSON.parse(event.data);
        var county = data["state"];

        var dataMap = {};
        var color = d3.scale.log()
            .domain([13, 20])
            .range(["hsl(214, 28%, 65%)", "hsl(214, 56%, 31%)"])
            .interpolate(d3.interpolateHcl);
        
        color = d3.scale.linear()
            .domain([22, 30])
            .range(["rgb(111, 190, 253)", "rgb(232, 133, 137)"]);
        //.interpolate(d3.interpolateHcl);

        var avgPressure = (data["count"] === 0) ? data["pressure"] : data["pressure"]  / data["count"];
        //console.log(getDewPoint(avgPressure , data["temperature"]  / data["count"]));
        dataMap[county] = color(data.temperature / data.count);// color(getDewPoint(avgPressure , data["temperature"]  / data["count"]));

        console.log(getDewPoint(avgPressure , data["temperature"]  / data["count"]) + " " + data.temperature / data.count + " " + dataMap[county]);
        map.updateChoropleth(dataMap);
    };
    
    var onError = function(event) {
        alert(event.data);
    }
    

    WebSocketClient = {
        init: function() {
            open();
        }
    };
}

$(function() {
    window.map = new Datamap({
        element: document.getElementById('countryMapContainer'),
        scope: 'usa',
        fills: {
            defaultFill: 'rgb(111, 190, 253)'
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                url = "i3a.html?state=" + geography.id;
                //TODO instead open popup window $( location ).attr("href", url);
            });
        }
    WebSocketClient.init();
});
