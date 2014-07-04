"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "apiEndpoint": "http://localhost:8090/Pickup/server/index.php/api"
})

;