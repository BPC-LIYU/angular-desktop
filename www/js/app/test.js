/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('testCtrl', function ($scope, httpReq, showMessage, showConfirm, showToast) {

    var tests = $scope.tests = [];
    tests.push({
        name: "showMessage",
        callback: function () {
            showMessage("温馨提示", "保存成功");
        }
    });
    tests.push({
        name: "showConfirm",
        callback: function () {
            showConfirm("温馨提示", "是否确认删除").then(function () {
                alert("ok");
            }, function () {
                alert("cancel")
            })
        }
    });
    tests.push({
        name: "showToast",
        callback: function () {
            showToast("toast提示","success");
        }
    });
});