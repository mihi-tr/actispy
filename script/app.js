
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
      when('/activities', {
        templateUrl: 'partials/activities.html',
        controller: 'ActivitiesCtrl'
      }).
      when('/settings', {
        templateUrl: 'partials/settings.html',
        controller: 'SettingsCtrl'
      }).
      when('/about', {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl'
      }).
      otherwise({
        redirectTo: '/menu'
      });
  }]);
