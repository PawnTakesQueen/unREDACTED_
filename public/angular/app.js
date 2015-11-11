// Declare app level module which depends on filters, and services
var myApp = angular.module('unREDACTED_', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/index',
  }).
  when('/compose', {
    templateUrl: 'partials/compose',
    controller: 'ComposeCtrl'
  }).
  when('/replies', {
    templateUrl: 'partials/replies',
    controller: 'RepliesCtrl'
  }).
  when('/protocol', {
    templateUrl: 'partials/protocol',
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
