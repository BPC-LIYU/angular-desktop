/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'perfect_scrollbar', 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services', 'directive', 'ui.codemirror', "infinite-scroll"]);
app.run(function ($rootScope) {
    $rootScope.base_config = base_config;
});
app.config(['$stateProvider', '$urlRouterProvider', 'modalBoxProvider', 'mqttProvider', function ($stateProvider, $urlRouterProvider, modalBoxProvider, mqttProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "app/login/login.html",
            controller: "loginCtrl"
        })
        .state('join_org', {
            url: '/join_org',
            templateUrl: "app/organization/join_org.html",
            controller: "firstJoinOrgCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: "app/main/main.html",
            controller: "mainCtrl"
        })
        .state('main.message', {
            url: '/message',
            templateUrl: "app/message/message.html",
            controller: "messageCtrl"
        })
        .state('main.contacts', {
            url: '/contacts',
            templateUrl: "app/contacts/contacts.html",
            controller: "contactsCtrl"
        })
        .state('main.contacts.org_group', {
            url: '/org_group',
            templateUrl: "app/contacts/org_group/org_group.html",
            controller: "orgGroupCtrl"
        })
        .state('main.contacts.relationship', {
            url: '/relationship',
            templateUrl: "app/contacts/relationship/relationship.html",
            controller: "relationshipCtrl"
        })
        .state('main.application', {
            url: '/application',
            templateUrl: "app/application/application.html",
            controller: "applicationCtrl"
        })
        .state('main.push', {
            url: '/push',
            templateUrl: "app/push/push.html",
            controller: "pushCtrl"
        })
        .state('main.test', {
            url: '/test',
            templateUrl: "app/test/test.html",
            controller: "testCtrl"
        })
        .state('main.develop', {
            url: '/develop',
            templateUrl: "app/develop/develop.html",
            controller: "developCtrl"
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

    modalBoxProvider
        .set('test', {
            templateUrl: "app/test/test_right_box.html",
            controller: "testRigthBoxCtrl",
            type: "rightBox"
        })
        .set("develop", {
            templateUrl: "app/develop/develop_right_box.html",
            controller: "developRigthBoxCtrl",
            type: "rightBox"
        })
        .set("user_info", {
            templateUrl: "app/user_info/user_info.html",
            controller: "userInfoCtrl"
        })
        .set("create_organization", {
            templateUrl: "app/organization/create_organization.html",
            controller: "organizationCreateCtrl"
        })
        .set("create_group", {
            templateUrl: "app/organization/create_group.html",
            controller: "groupCreateCtrl"
        })
        .set("modefy_group", {
            templateUrl: "app/organization/modefy_group.html",
            controller: "groupModefyCtrl"
        })
        .set("join_organization", {
            templateUrl: "app/organization/join_organization.html",
            controller: "joinOrgCtrl"
        })
        .set("modefy_org_apply", {
            templateUrl: "app/organization/modefy_org_apply.html",
            controller: "modefyOrgApplyCtrl"
        });

    base_config.mqtt.device_id = (new Date()).valueOf();
    mqttProvider.set(base_config.mqtt);

}]);