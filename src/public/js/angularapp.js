var agentIQ = agentIQ || {};

var iqMessengerURL = 'https://iq-messenger-canary.herokuapp.com'; 

agentIQ.containerElement = document.getElementById('iq-messenger-container');

agentIQ.formID = 'iq-message-id-send-form';
agentIQ.formInputID = 'iq-message-id-send-form-input';
agentIQ.messagesContainerID = 'iq-message-id-message-list';

agentIQ.formElement = document.getElementById(agentIQ.formID);
agentIQ.formInputElement = document.getElementById(agentIQ.formInputID);
agentIQ.messagesContainerElement = document.getElementById(agentIQ.messagesContainerID);

agentIQ.messengerServiceClient = iqMessengerURL + '/socket.io/socket.io.js';

$( document ).ready(function() {
	appendPrimer();
});

function appendPrimer() {
    // add in an image pixel to ensure the client gets a cookie before attempting to open a socket connection.
    var img = document.createElement('img');
    img.src = iqMessengerURL + '/primer.png';
    agentIQ.containerElement.appendChild(img);
}

var angularapp = angular.module('agentIQ', []);

angularapp.controller('mainCtrl', function($scope, $window, $http, socket){
	$scope.messages = []; 

	$scope.openSocketClient = function(){
		if (!$scope.chatSocket){
			$scope.chatSocket = socket.getSocket();  

			agentIQ.formInputElement.value = '';

			$scope.chatSocket.emit('send_to', $scope.messagetext);

			$scope.messages.push({type: 'outbound', message: $scope.messagetext, media: ''});

			$scope.chatSocket.on('receive_from', function(data) {
	            data.type = 'inbound'
	            $scope.messages.push(data);
	        });	

	        $scope.chatSocket.on('new_tab', function() {
            	agentIQ.form_input.value = 'New tab opened, we only support one tab at a time.  Please refresh if you need to use this tab.';
	            agentIQ.form.className = 'iq-message-class inactive';
	            agentIQ.form_input.setAttribute('disabled', true)
	        });
		}
	}
	
	$scope.sendMessage = function($event){
		$event.preventDefault(); 

		$scope.openSocketClient();
	}; 
}); 

angularapp.factory('socket', function(){
	var chatSocket; 

	return{
		getSocket: function(){
			chatSocket = new io(iqMessengerURL);
			return chatSocket; 
		}, 
		send: function(messagetext){

		}
		/*
		emit: function(eventName, data){
			chatSocket.emit(eventName, data);
		}, 
		on: function(eventName, callback){
			chatSocket.on(eventName, callback); 
		}*/
	}
});