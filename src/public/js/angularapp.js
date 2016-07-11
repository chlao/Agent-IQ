var angularapp = angular.module('agentIQ', []);

angularapp.controller('mainCtrl', function($scope, $window, $http, socket){
	$scope.messages = []; 

	$scope.iqMessengerURL = 'https://iq-messenger-canary.herokuapp.com'; 

	$scope.containerElement = document.getElementById('iq-messenger-container');

	$scope.formID = 'iq-message-id-send-form';
	$scope.formInputID = 'iq-message-id-send-form-input';
	$scope.messagesContainerID = 'iq-message-id-message-list';

	$scope.formElement = document.getElementById($scope.formID);
	$scope.formInputElement = document.getElementById($scope.formInputID);
	$scope.messagesContainerElement = document.getElementById($scope.messagesContainerID);


	angular.element(document).ready(function(){
		appendPrimer();

		function appendPrimer() {
		    // add in an image pixel to ensure the client gets a cookie before attempting to open a socket connection.
		    var img = document.createElement('img');
		    img.src = $scope.iqMessengerURL + '/primer.png';
		    $scope.containerElement.appendChild(img);
		}
	}); 

	$scope.openSocketClient = function(){
		if (!$scope.chatSocket){
			$scope.chatSocket = socket.getSocket($scope.iqMessengerURL);  

			$scope.chatSocket.on('receive_from', function(data) {
	            data.type = 'inbound'
	            $scope.messages.push(data);
	            $scope.$apply(); 
	        });	

	        $scope.chatSocket.on('new_tab', function() {
            	agentIQ.form_input.value = 'New tab opened, we only support one tab at a time.  Please refresh if you need to use this tab.';
	            agentIQ.form.className = 'iq-message-class inactive';
	            agentIQ.form_input.setAttribute('disabled', true)
	        });
		}
	};
	
	$scope.sendMessage = function($event){
		$event.preventDefault(); 

		$scope.openSocketClient();

		$scope.formInputElement.value = '';
		$scope.chatSocket.emit('send_to', $scope.messagetext);
		$scope.messages.push({type: 'outbound', message: $scope.messagetext, media: ''});
	}; 
}); 

angularapp.factory('socket', function(){
	var chatSocket; 

	return{
		getSocket: function(iqMessengerURL){
			chatSocket = new io(iqMessengerURL);
			return chatSocket; 
		}
	}
});