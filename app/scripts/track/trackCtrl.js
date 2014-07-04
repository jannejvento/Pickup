'use strict';

angular.module('pickupOptimizer')
  .controller('trackCtrl', ['$scope', '$window', '$http', '$state', 'configuration', 'userService', 'LocationService', '$timeout',
    function ($scope, $window, $http, $state, configuration, UserService, LocationService, $timeout) {

      $scope.trackingState = 0;
      $scope.endRouteButtonText = 'End';

      var markers = [];

      var buttonTexts = function () {
        switch ($scope.trackingState) {
          case 0:
            $scope.trackMeButtonText = 'Track me!';
            break;
          case 1:
            $scope.trackMeButtonText = 'Pause';
            getAndSaveLocation();
            break;
          case 2:
            $scope.trackMeButtonText = 'Continue';
            break;
        }
        ;
      };
      buttonTexts();

      $scope.$watch('trackingState', function (newValue, oldValue) {
        buttonTexts();
      });

      UserService.getUser()
        .then(function (p) {
          $scope.user = p.data;
          $scope.spectateUrl = 'spectate/user/' + p.data.id;
        }, function (p) {
          if (p.data.error) {
            if (p.status === 400) {
              $state.go('login');
            }
          }
        });

      $scope.endRoute = function () {
        var endPromise = LocationService.endRoute();
        endPromise.then(function (d) {
          $scope.trackingState = 0;
          flashMessage('Route ended...');
        });
      }

      $scope.lastSpot = function () {
        return markers[markers.length - 1];
      }

      $scope.spotCount = function () {
        return markers.length;
      }

      var centerToLastMarker = function (markers) {
        var last = markers[markers.length - 1];
        $scope.center.lat = last.lat;
        $scope.center.lng = last.lng;
      }

      var flashMessage = function (message) {
        $scope.communicationInfo = message;
        $timeout(function () {
          $scope.communicationInfo = '';
        }, 2000);
      }

      var sendLocationToServer = function (params) {

        var location = {
          lat: params.coords.latitude,
          lng: params.coords.longitude,
          acc: params.coords.accuracy
        };
        LocationService.sendToServer(location)
          .then(function () {
            flashMessage('Sent and saved..');
          }, function (data) {
            flashMessage(data.data.message);
          });
      }

      var pushToMarkerArray = function (lat, lng, acc) {
        var lastPoint = {lat: null, lng: null, acc: null};

        if (markers.length > 0) {
          var lastPoint = markers[markers.length - 1];
        }

        if (lastPoint.lat !== lat ||
          lastPoint.lng !== lng ||
          lastPoint.acc !== acc) {
          markers.push({
            lat: lat,
            lng: lng,
            dragggable: false,
            acc: acc,
            message: 'Accuracy: ' + acc + 'm',
            focus: true
          });
          return true;
        } else {
          return false;
        }
      }


      var getAndSaveLocation = function () {
        LocationService.getLocation()
          .then(function (data) {
            if (pushToMarkerArray(data.coords.latitude, data.coords.longitude, data.coords.accuracy)) {
              $scope.markers.m1 = markers[markers.length - 1];
              centerToLastMarker(markers);
              sendLocationToServer(data);
            }
            if ($scope.trackingState === 1) {
              $timeout(function () {
                getAndSaveLocation();
              }, 10000);

            }
          });
      }

      $scope.trackMe = function () {
        if ($scope.trackingState === 0) {
          $scope.trackingState = 1;
          markers = [];
        } else if ($scope.trackingState === 1) {
          $scope.trackingState = 2;
        } else if ($scope.trackingState === 2) {
          $scope.trackingState = 1;
        }
      }

      angular.extend($scope, {
        paths: {
          myRoute: {
            color: '#008000',
            weight: 4,
            latlngs: markers
          }
        },
        markers: {
        },

        center: {
          lat: 53,
          lng: -3,
          zoom: 12
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
      $window.addEventListener('focus', function (d) {

      }, false);
    }]);
