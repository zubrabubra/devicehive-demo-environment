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
		tick();
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
	
	var onMessage = function(event) {
		var temp = "temperature";
		var pressure = "pressure";
		var count = "count";
		var state = "state"
		var data = JSON.parse(event.data);
        if(data[temp] && data[count] && data[count] != 0 && stateFromQuery.localeCompare(data[state]) == 0){
			temperatureArray.push(transformFromCtoF(data[temp] / data[count]));
		}
		if(data[pressure] && data[temp] && data[count] && data[count] != 0 && stateFromQuery.localeCompare(data[state]) == 0){
			dewPointArray.push(transformFromCtoF(getDewPoint(data[pressure]/ data[count], data[temp]/ data[count])));
		}
		if(data[pressure] && data[count] && data[count] != 0 && stateFromQuery.localeCompare(data[state]) == 0){
			humidityArray.push(data[pressure]/ data[count]);
		}

	};
	
	function getDewPoint(pressure, temperature) {
	   var b = 237.7;
	   var a = 17.27;
	   var gamma = (a * temperature) / (b + temperature) + Math.log(pressure / 100);
	   return (b * gamma) / (a - gamma);
	}
	function transformFromCtoF(degree){
		return degree*9/5+32
	}
	
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
	WebSocketClient.init();
});