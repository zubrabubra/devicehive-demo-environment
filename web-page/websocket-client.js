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
		var color = d3.scale.linear()
		.domain([22, 33])
		.range(["hsl(214, 28%, 65%)", "hsl(214, 56%, 31%)"])
		.interpolate(d3.interpolateHcl);

		var avgPressure = (data["count"] === 0) ? data["pressure"] : data["pressure"]  / data["count"];
		console.log(getDewPoint(avgPressure , data["temperature"]  / data["count"]));
		dataMap[county] = color(getDewPoint(avgPressure , data["temperature"]  / data["count"]));
		map.updateChoropleth(dataMap);
	};
	
	var onError = function(event) {
		alert(event.data);
	}
	
	WebSocketClient = {
		init: function() {			
			connectButton = $('#connectButton');
			disconnectButton = $('#disconnectButton'); 
			
			connectButton.click(function(e) {
				close();
				open();
			});
			
			disconnectButton.click(function(e) {
				close();
			});
			
		}
	};
}

$(function() {
	WebSocketClient.init();
});
