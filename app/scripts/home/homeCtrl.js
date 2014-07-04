'use strict';

angular.module('pickupOptimizer')
  .controller('homeCtrl', ['$scope', '$state', 'userService', function ($scope, $state, userService) {

    $scope.goTrackingState = function(){
      $state.go('track');
    }
    $scope.goStalk= function(){
      $state.go('stalk');
    }

    userService.getFollowedByMe()
      .then(function(data){
        $scope.followees = data.data;
      });

    userService.getFollowers()
      .then(function(data){
        $scope.followers = data.data;
      });

    $scope.follow = function(email){
      userService.followUser(email);
    }
  }]);