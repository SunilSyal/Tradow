angular.module('tradowApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/users.html'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UserCtrl',
        controllerAs: 'userCtrl'
      })
      .when('/plans', {
        templateUrl: 'views/plans.html',
        controller: 'PlanCtrl',
        controllerAs: 'planCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
