new function() {
	var ws = null;
	var connectButton;
	var disconnectButton; 

	var open = function() {
		var host = '52.34.199.168';
		ws = new WebSocket("ws://" +host  + ":9000/notifications");
		ws = {};
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

		var data = JSON.parse(event.data);
        if(data["count"] && data["count"] != 0 && stateFromQuery.localeCompare(data["state"]) == 0){
			onMassageArray.push(data["temperature"] / data["count"]);
		}

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