/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('mainCtrl', function ($scope, auth, api, my_organization, modalBox, $location, myUserInfo, $state, mqtt, showConfirm) {
    var main_view = $scope.main_view = {};


    $scope.logout = function () {
        auth.logout();
    };
    $scope.reset_userinfo = function () {
        myUserInfo.getUserInfo().then(function (my_user_info) {
            main_view.my_user_info = my_user_info;
        });
    };
    $scope.enter_application = function () {
        $state.go("main.application");
    }
    

    $scope.create_organization = function () {
        modalBox.show('create_organization', null);
    };


    function init() {
        $scope.reset_userinfo();
        myUserInfo.getUserInfo().then(function (my_user_info) {
            mqtt.login(my_user_info.id, my_user_info.imusername, my_user_info.impassword)
        });
        my_organization.get_my_organziation();
    }

    init();

});