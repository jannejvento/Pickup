'use strict';

angular.module('pickupOptimizer')
  .factory('configuration', function (ENV) {
    return {
      getBaseUrl: function () {
        return ENV.apiEndpoint;
      }
    };

  });