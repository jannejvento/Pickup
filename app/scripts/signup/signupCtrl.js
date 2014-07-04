'use strict';

angular.module('pickupOptimizer')
  .controller('signupCtrl', ['$scope', 'userService', '$state', function ($scope, UserService, $state) {
  	$scope.error = '';
  	$scope.user = {};

  	$scope.signup = function(){
  		console.log($scope.user);
  		if((!$scope.user || !$scope.user.password || !$scope.user.email)
  			|| $scope.user.password !== $scope.user.password_confirmation){

  			$scope.error = 'No good..';
  			return;
  		}
  		$scope.error = '';

  		UserService.createUser($scope.user);

  	}
  }]);