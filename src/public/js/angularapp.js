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

			$scope.chatSocket.emit('send_to', agentIQ.formInputElement.value);

			agentIQ.formInputElement.value = '';

			//$scope.apply(); 

			console.log(document.body.innerHTML); 

			$scope.chatSocket.on('receive_from', function(data) {
	            data.type = 'inbound'
	            $scope.messages.push(data);
	            //$scope.apply(); 
	        });	

	        $scope.chatSocket.on('new_tab', function() {
            	agentIQ.form_input.value = 'New tab opened, we only support one tab at a time.  Please refresh if you need to use this tab.';
	            agentIQ.form.className = 'iq-message-class inactive';
	            agentIQ.form_input.setAttribute('disabled', true)
	        });
		}
	}
	
	$scope.sendMessage = function(){
		$scope.messages.push({type: 'outbound', message: $scope.messagetext, media: ''});

		$scope.openSocketClient();
	}; 
}); 

angularapp.factory('socket', function(){
	var chatSocket; 
	chatSocket = io.connect(); 

	return{
		getSocket: function(){
			//chatSocket = io.connect(); 
			chatSocket = new io(iqMessengerURL);
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
