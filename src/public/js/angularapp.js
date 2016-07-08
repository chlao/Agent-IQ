var agentIQ = agentIQ || {};

//var iqMessengerURL = 'https://iq-messenger-canary.herokuapp.com'; 

/*agentIQ.partials = {};
agentIQ.partials.chat = '' +
      '<form ng-submit="sendMessage()" id="iq-message-id-send-form" action="">' +
        '<input id="iq-message-id-send-form-input" autocomplete="off" />' +
        '<button id="iq-message-id-submit-button" type="submit">Send</button>' +
      '</form>';*/



agentIQ.containerElement = document.getElementById('iq-messenger-container');

agentIQ.formID = 'iq-message-id-send-form';
agentIQ.formInputID = 'iq-message-id-send-form-input';
agentIQ.messagesContainerID = 'iq-message-id-message-list';

agentIQ.formElement = document.getElementById(agentIQ.formID);
agentIQ.formInputElement = document.getElementById(agentIQ.formInputID);
agentIQ.messagesContainerElement = document.getElementById(agentIQ.messagesContainerID);


function addIQMessenger(iqMessengerURL) {
	agentIQ.messengerService = iqMessengerURL;
	agentIQ.messengerServiceClient = agentIQ.messengerService + '/socket.io/socket.io.js';

    // Add in the chat partial
    //agentIQ.containerElement.innerHTML = agentIQ.partials.chat;

    // Drop the session cookie so user re-connections are possible
    appendPrimer();

    agentIQ.messages = [];

    loadScript(agentIQ.messengerServiceClient, loadClient);

    function appendPrimer() {
        // add in an image pixel to ensure the client gets a cookie before attempting to open a socket connection.
        var img = document.createElement('img');
        img.src = agentIQ.messengerService + '/primer.png';
        agentIQ.containerElement.appendChild(img);
    }

    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", url);
        document.body.appendChild(script);
        script.onload = function(){
            return callback();
        }
    }

    function loadClient() {
        agentIQ.formInputElement.onfocus = openSocketClient;
    }

    function openSocketClient() {
        if(!agentIQ.chatSocket) {
            agentIQ.chatSocket = new io(agentIQ.messengerService);
            
            agentIQ.formElement.addEventListener('submit', function(event){
                event.preventDefault();

                agentIQ.chatSocket.emit('send_to', agentIQ.formInputElement.value);
                //agentIQ.messages.push({type: 'outbound', message: agentIQ.formInputElement.value, media: ''});

                agentIQ.formInputElement.value = '';

                //agentIQ.renderMessages();
                return false;
            });

            agentIQ.chatSocket.on('receive_from', function(data) {
                data.type = 'inbound'
                agentIQ.messages.push(data);
                agentIQ.renderMessages();
            });

            agentIQ.chatSocket.on('new_tab', function() {
                agentIQ.form_input.value = 'New tab opened, we only support one tab at a time.  Please refresh if you need to use this tab.';
                agentIQ.form.className = 'iq-message-class inactive';
                agentIQ.form_input.setAttribute('disabled', true)
            });
        }
    }
}


agentIQ.renderMessages = function() {
    var msg_obj = agentIQ.messages[ agentIQ.messages.length - 1 ];
    var new_msg_el = document.createElement('li');
    new_msg_el.textContent = msg_obj.message;
    new_msg_el.className = 'iq-message-class-message ' + msg_obj.type;

    if(msg_obj.media) {
        var media_el = document.createElement('img');
        media_el.src = msg_obj.media;
        new_msg_el.appendChild( media_el );
    }

    agentIQ.messagesContainerElement.appendChild( new_msg_el );
}

var angularapp = angular.module('agentIQ', []);

angularapp.controller('mainCtrl', function($scope, $window, $http, socket){
	$scope.messages = []; 

	$scope.chatSocket = socket.getSocket(); 

	$scope.sendMessage = function(){
		$scope.messages.push({type: 'outbound', message: $scope.messagetext, media: ''});
	}; 
}); 

angularapp.factory('socket', function($scope){
	var chatSocket; 
	
	return{
		getSocket: function(){
			if(!$scope.chatSocket) {
				chatSocket = new io(agentIQ.messengerService);
			}
			return chatSocket; 
		},
		emit: function(eventName, data){
			chatSocket.emit(eventName, data);
		}, 
		on: function(eventName, callback){
			chatSocket.on(eventName, callback); 
		}
	}
});

/*
angularapp.directive('chat-bubble', function(){
	return {
		template: "<li' class='iq-message-class-message'></li>", 
		link: function(scope, elem, attr){
			elem.innerHTML = scope.message; 
		}, 
		controller: 
	}
}); 
*/
