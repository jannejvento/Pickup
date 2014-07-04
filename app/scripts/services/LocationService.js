'use strict';

angular.module('pickupOptimizer')
  .factory('LocationService', ['$q', '$window', '$rootScope', '$http', 'configuration', function ($q, $window, $rootScope, $http, configuration) {
    var activeWatch = activeWatch || null;
    var journeyId = null;
    return {
      watch: function(success, failure){
        if(!!activeWatch) {return;}
        $window.navigator.geolocation.watchPosition(
          success, failure,
          {
            maximumAge: 10000,
            timeout: 50000,
            enableHighAccuracy: true
          });
      },
      endWatch: function(){
        if(!!activeWatch){
          $window.navigator.geolocation.endWatch(activeWatch);
          activeWatch = null;
        }
      },
      getLocation: function ()
      {
        var deferred = $q.defer();

        if (!$window.navigator) {
          $rootScope.$apply(function() {
            deferred.reject(new Error('Geolocation is not supported'));
          });
        } else {
          $window.navigator.geolocation.getCurrentPosition(function (position) {
              $rootScope.$apply(function() {
                deferred.resolve(position);
              });
            }, function (error) {
              $rootScope.$apply(function() {
                deferred.reject(error);
              });
            },
            {
              maximumAge: 10000,
              timeout: 50000,
              enableHighAccuracy: true
            }
          );
        }
        return deferred.promise;
      },
      sendToServer: function(location){
          location.journeyId = journeyId;
          return $http.post(configuration.getBaseUrl() + '/location', location).then(function(d){
              journeyId = d.data['journey_id'];
              console.log(d);
              return d;
          });
      },
      endRoute: function(){
        return $http.post(configuration.getBaseUrl() + '/route/end', {routeId: journeyId})
            .then(function(d){
                journeyId = null;
                return d;
            });
      }
      
    };
  }]);