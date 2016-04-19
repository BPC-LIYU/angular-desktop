/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('testCtrl', function ($scope, httpReq, showMessage, showConfirm) {
    $scope.showModal = function () {
        showMessage("温馨提示", "保存成功");
    }
    $scope.showConfirm = function () {
        showConfirm("温馨提示", "是否确认删除").then(function () {
            alert("ok");
        }, function () {
            alert("cancel")
        })
    }

});