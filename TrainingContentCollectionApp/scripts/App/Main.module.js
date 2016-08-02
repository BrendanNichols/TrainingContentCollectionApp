(function () {
    var app = angular.module('app', ['ngResource', 'ui.router', 'mainServices','ui.bootstrap']);
    console.log("in main module");
    app.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', function ($stateProvider, $urlRouterProvider, $resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'mainController'
            })
            .state('home.form', {
                url: 'form/:Page',
                templateUrl: 'form.html',
                controller: 'formController'
            })

    }])
})();