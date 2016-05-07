/**
 * Created by wangjian on 16/4/27.
 */
app.controller('userInfoCtrl', function ($scope, args, $uibModalInstance, $q, api, UserInfo, $state, IM) {

    var user_id = args.user_id;
    $scope.user_info = null;
    UserInfo.getUserInfoById(user_id).then(function (user_info) {
        $scope.user_info = user_info;
    });
    $scope.send_message = function () {
        IM.get_chat(0, user_id);
        $uibModalInstance.close();
    }
});