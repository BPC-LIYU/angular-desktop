/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('messageCtrl', function ($scope, httpReq, mqtt) {
    $scope.messages = [];
    $scope.send_text = function () {
        mqtt.send_text_message(0, '123', 1, '123');
    };
    $scope.$on('im_chat', function (event, data) {
        // console.log('im_chat data:', data);
        $scope.messages.push(data);
    });
    $scope.$on('im_chat_session', function (event, data) {
        console.log('im_chat_session data:', data);
    })
    mqtt.ready(function () {
        mqtt.get_chat_session().then(function (list) {
            console.log(list);
        })
    });
});