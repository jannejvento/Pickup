'use strict';

angular.module('pickupOptimizer')
  .controller('loginCtrl', ['$scope', 'userService', '$state', function ($scope, UserService, $state) {


    $scope.login = function () {
      UserService.login($scope.user)
        .success(function (data) {
          UserService.setAuthToken(data);
          $state.go('main');
        })
        .error(function () {
          $scope.error = "No good";
        });
    };

    $scope.signup = function(){
      UserService.createUser($scope.user)
        .success(function(data){
          $scope.login();
        });
    }
  }]);