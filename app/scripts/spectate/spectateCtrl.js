'use strict';

angular.module('pickupOptimizer')
  .controller('spectateCtrl', ['$scope','_', 'userService','$state','$stateParams', '$http', 'configuration','$window',
    function ($scope, _, UserService, $state, $stateParams, $http, configuration, $window) {

      function applyHeight() {
        $scope.mapHeight = $window.innerHeight-$('#topRow').height()- 50;
      }

      angular.element($window).bind('resize', function() {
        applyHeight();
        $scope.resizeMap();
        scope.$apply();
      });

      applyHeight();


      $scope.userId = $stateParams.userId;



      var markers = [];
      var mark = {
        lat: null,
        lng: null,
        focus: true
      };
      $scope.checkNewLocations = function(){
        loadLocation();
      }

      var loadLocation = function(){
        $http.get(configuration.getBaseUrl() + '/location/user/'+$scope.userId)
          .then(function(response){
            if(response.data.success){
              var coords = response.data.data.locations;
            }

            var latest=null;

            for(var i=coords.length-1;i>=0;i--){
              if(!_.findWhere(markers, {id: coords[i].id})){
                latest ={
                  id: coords[i].id,
                  lat:  parseFloat(coords[i].latitude),
                  lng: parseFloat(coords[i].longitude),
                  accuracy: parseFloat(coords[i].accuracy),
                  message: 'Acc: ' + coords[i].accuracy + ', ' + coords[i].created_at,
                  focus: true
                };
                markers.push(latest);
              }
            }
            if(latest){
              mark = latest;
              $scope.markers.m1 = mark;
              centerToLastMarker(markers);
            }

          });
      }
      var centerToLastMarker = function(markers){
        var last = markers[markers.length-1];
        $scope.center.lat = last.lat;
        $scope.center.lng = last.lng;
      }
      angular.extend($scope, {
        paths: {
          myRoute:{
            color: '#008000',
            weight: 4,
            latlngs: markers
          }
        },
        center:{
          lat: 53,
          lng: -3,
          zoom: 15
        },
        markers: {

        },
        defaults: {
          tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
          maxZoom: 14,
          path: {
            weight: 10,
            color: '#800000',
            opacity: 1
          }
        }
      });

      loadLocation();
    }]);