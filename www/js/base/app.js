/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services', 'directive']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "templates/login/login.html",
            controller: "loginCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: "templates/main/main.html",
            controller: "mainCtrl"
        })
        .state('main.message', {
            url: '/message',
            templateUrl: "templates/message/message.html",
            controller: "messageCtrl"
        })
        .state('main.contacts', {
            url: '/contacts',
            templateUrl: "templates/contacts/contacts.html",
            controller: "contactsCtrl"
        })
        .state('main.application', {
            url: '/application',
            templateUrl: "templates/application/application.html",
            controller: "applicationCtrl"
        })
        .state('main.push', {
            url: '/push',
            templateUrl: "templates/push/push.html",
            controller: "pushCtrl"
        })
        .state('main.test', {
            url: '/test',
            templateUrl: "templates/test.html",
            controller: "testCtrl"
        })

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var auth = $injector.get("auth");
        auth.hasLogin().then(function (has_login) {
            if (has_login) {
                $location.replace().path("/main/message");
            }
            else {
                $location.replace().path("/login");
            }

        })

    });
}]);