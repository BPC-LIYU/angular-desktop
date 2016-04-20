/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('mainCtrl', function ($scope, httpReq, auth, $location) {

    $scope.logout = function () {
        auth.logout().then(function () {
            $location.replace().path("/login");
        })
    }
});