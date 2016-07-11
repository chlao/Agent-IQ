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

		$scope.openSocketClient();
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
	            agentIQ.form_input.setAttribute('disabled', true); 
	        });

	        $scope.chatSocket.on('receive_from_img', function(){

	        }); 
		}
	};
	
	$scope.sendMessage = function($event){
		$event.preventDefault(); 

		$scope.formInputElement.value = '';
		$scope.chatSocket.emit('send_to', $scope.messagetext);
		$scope.messages.push({type: 'outbound', message: $scope.messagetext, media: ''});
	}; 

	$scope.processImg = function(element){
		var file = element.files[0]; 

		var reader = new FileReader();

		reader.onload = readSuccess; 

		function readSuccess(event){
			$scope.messages.push({type: 'outbound', message: event.target.result, media: 'img'});
			//console.log(event.target.result); 
			$scope.$apply(); 
		}

		reader.readAsDataURL(file);  

		// Display image 
		// 

		$scope.chatSocket.emit('send_to_img', file); 
	}
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