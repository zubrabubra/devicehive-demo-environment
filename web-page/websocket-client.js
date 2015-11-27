new function() {
	var ws = null;
	
	var connectButton;
	var disconnectButton; 

	var open = function() {
		ws = new WebSocket("ws://localhost:9000/notifications");
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onmessage = onMessage;
		alert(ws.onmessage);
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
	
	var onMessage = function(event) {
		var data = event.data;
		console.log(data);
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