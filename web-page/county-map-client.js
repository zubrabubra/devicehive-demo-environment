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
    };
    
    var close = function() {
        if (ws) {
            console.log('CLOSING WS...');
            ws.close();
        }
    };
    
    var onOpen = function() {
        console.log('WS OPENED');
    };
    
    var onClose = function() {
        console.log('WS CLOSED');
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
        var avgTemperature = (data["count"] === 0) ? data["temperature"] : data["temperature"]  / data["count"];
        //console.log(getDewPoint(avgPressure , data["temperature"]  / data["count"]));
        dataMap[county] = color(data.temperature / data.count);// color(getDewPoint(avgPressure , data["temperature"]  / data["count"]));

        window.states[data.state] = {state: usStates[data.state], temperature: Math.round10(avgTemperature, -1), pressure: Math.round10(avgPressure, -2)};
        window.table.forceUpdate();

        //console.log(getDewPoint(avgPressure , data["temperature"]  / data["count"]) + " " + data.temperature / data.count + " " + dataMap[county]);
        map.updateChoropleth(dataMap);
    };
    
    var onError = function(event) {
        alert(event.data);
    };
    

    WebSocketClient = {
        init: function() {
            open();
        }
    };
};

$(function() {

    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

    window.map = new Datamap({
        element: document.getElementById('countryMapContainer'),
        scope: 'usa',
        fills: {
            defaultFill: 'rgb(111, 190, 253)'
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
		window.stateFromQuery = geography.id;
		$("#modal-title").text(usStates[geography.id]);
		$('#modal-live-state-feed').modal('show');
		var ff = runChartForFirstTime;
		runChartForFirstTime = function() {};
		ff();
            })
        }
	});
    WebSocketClient.init();
});
