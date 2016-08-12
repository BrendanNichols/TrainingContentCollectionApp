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
    //uploading file directive
    app.directive('ngFiles', ['$parse', function ($parse) {

        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        };

        return {
            link: fn_link
        }
    }])
})();