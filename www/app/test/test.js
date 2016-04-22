/**
 * Created by fanjunwei on 16/4/18.
 */
app
    .controller('testCtrl', function ($scope, httpReq, showMessage, showConfirm, showToast, Upload, loading, $timeout, modalBox) {
        $scope.data2 = {
            open: false
        };
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
                showToast("toast提示", "success");
            }
        });
        tests.push({
            name: "loading",
            callback: function () {
                loading.show();
                $timeout(function () {
                    loading.hide();
                }, 1000);
            }
        });
        tests.push({
            name: "showRighBox",
            callback: function () {
                modalBox.show('test', {a: "1"});
            }
        });

        $scope.open2 = function () {
            $scope.data2.open = true;
        }
        $scope.files = [];
        $scope.file = null;
        $scope.submit_file = function () {
            alert($scope.files.length)
        }
        $scope.upload = function (file) {
            Upload.upload({
                url: 'upload/url',
                data: {file: file, 'username': $scope.username}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
    })
    .controller('testRigthBoxCtrl', function (args) {
        console.log(args);
    })