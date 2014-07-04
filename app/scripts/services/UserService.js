'use strict';

angular.module('pickupOptimizer')
  .factory('userService', ['$http', '$q', 'configuration', 'ENV', function ($http, $q, configuration, ENV) {
    
    var baseUrl = ENV.apiEndpoint + '/user';
    var userService = {};
    var authToken = null;
    var user = null;

    var setAuthHeader = function(token){
      $http.defaults.headers.common.Auth = token;
    };

    userService.setAuthToken = function(token){
      if(!!token){
        localStorage.setItem('pickupAuthToken', token);
        setAuthHeader(token);
        authToken = token;
      }else{
        localStorage.removeItem('pickupAuthToken');
        setAuthHeader('');
        authToken = null;
      }
    };

    userService.getAuthToken = function(){
        
        
      if(!!authToken)
      {
          console.log(authToken);
          return authToken;
      }else if(!!localStorage.pickupAuthToken){
          authToken = localStorage.pickupAuthToken;
          setAuthHeader(authToken);
      }else {
          console.log(authToken);
          setAuthHeader('');
      }
      
      
    };

    userService.login = function (user) {
      return $http.post(baseUrl + '/login', user);
    };

    userService.getUser = function(){
      return $http.get(baseUrl + '/status')
    }

    userService.getFollowers = function(){
      return $http.get(baseUrl + '/follower');
    };
    userService.getFollowedByMe = function(){
      return $http.get(baseUrl + '/followed');
    };

    userService.followUser = function(email){
      return $http.post(baseUrl + '/follower', {emailToFollow: email});
    }
    userService.createUser = function(user){
      return $http.post(baseUrl + '/signup', user);
    }

    userService.getAllUsers = function(){
      return $http.get(baseUrl + '/all');
    }
    return userService;
  }]);