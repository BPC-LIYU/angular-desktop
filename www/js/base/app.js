/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "templates/app/login.html",
            controller: "loginCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: "templates/app/main.html",
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

    $urlRouterProvider.otherwise('/main');
}]);