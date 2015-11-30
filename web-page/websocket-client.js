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
		//alert(ws.onmessage);
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
	  return temperature; //TODO
	}

	function getColor(pressure, temperature, points, colors) {
	var dewPoint = getDewPoint(pressure, temperature);
    for (var i = 0; i < points.length; i++) {
       if (dewPoint <= points[i]) {
         return colors[i];
       }
    }

    return 'rgb(8,48,107)'; //default value

    }
	
	var onMessage = function(event) {

       var colors = ['rgb(247,251,255)', 'rgb(8,48,107)', 'rgb(198,219,239)', 'rgb(158,202,225)', 'rgb(107,174,214)', 'rgb(66,146,198)', 'rgb(33,113,181)', 'rgb(8,81,156)', 'rgb(8,48,107)']
	   var points = [23, 25];

		var data = JSON.parse(event.data);
		var county = data["state"];

		var dataMap = {};
		//TODO check count value should be non zero
		dataMap[county] = getColor(data["pressure"] / data["count"], data["temperature"] / data["count"], points, colors);

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
