// Declare app level module which depends on filters, and services
var myApp = angular.module('unREDACTED_', ['ngRoute']);

myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/index',
    })
    .when('/compose', {
      templateUrl: 'partials/compose',
      controller: 'ComposeCtrl'
    })
    .when('/replies', {
      templateUrl: 'partials/replies',
      controller: 'RepliesCtrl'
    })
    .when('/protocol', {
      templateUrl: 'partials/protocol',
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    })
    .hashPrefix('!');
});
