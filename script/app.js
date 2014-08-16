
var actispyApp = angular.module('actispyApp', [
    'ngRoute',
    'ngTouch',
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
