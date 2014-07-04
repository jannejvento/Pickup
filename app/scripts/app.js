'use strict';

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});


var pickupOptimizer = angular.module('pickupOptimizer', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'leaflet-directive',
    'underscore',
    'config'
  ])
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'signupCtrl'
      })
      .state('home',{
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      })
      .state('track', {
        url: '/track',
        templateUrl: 'views/track.html',
        controller: 'trackCtrl'
      })
      .state('stalk', {
        url: '/spectate/user/:userId',
        templateUrl :'views/spectate.html',
        controller: 'spectateCtrl'
      });
  })
  .run(function(userService){
    userService.getAuthToken();
  })
  .factory('authInterceptor', ['$injector', function($injector) {
    return {
      request: function(config) {
        return config;
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejectReason){
        if(rejectReason.status === 401){
          //$injector.get('$state').transitionTo('login');
        }
        return rejectReason;
      }
    };

  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
