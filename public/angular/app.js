// Declare app level module which depends on filters, and services
var myApp = angular.module('unREDACTED', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'IndexCtrl'
  }).
  when('/compose', {
    templateUrl: 'partials/compose',
    controller: 'ComposeCtrl'
  }).
  when('/replies', {
    templateUrl: 'partials/replies',
    controller: 'RepliesCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
