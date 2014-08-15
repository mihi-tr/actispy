
var actispyApp = angular.module('actispyApp', [
    'ngRoute',
    'actispyControllers'
    ]);

actispyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/menu', {
        templateUrl: 'partials/menu.html',
        controller: 'MenuCtrl'
      }).
      when('/new', {
        templateUrl: 'partials/new.html',
        controller: 'NewActivityCtrl'
      }).
      otherwise({
        redirectTo: '/menu'
      });
  }]);
