/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services', 'directive']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "templates/app/login.html",
            controller: "loginCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: "templates/app/main/main.html",
            controller: "mainCtrl"
        })
        .state('main.message', {
            url: '/message',
            templateUrl: "templates/app/message.html",
            controller: "messageCtrl"
        })
        .state('main.test', {
            url: '/test',
            templateUrl: "templates/app/test.html",
            controller: "testCtrl"
        })

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var auth = $injector.get("auth");
        auth.hasLogin().then(function (has_login) {
            if (has_login) {
                $location.replace().path("/main");
            }
            else {
                $location.replace().path("/login");
            }

        })

    });
}]);