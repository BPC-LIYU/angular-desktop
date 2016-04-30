/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('messageCtrl', function ($scope, httpReq, mqtt, UserInfo, icon_default, $timeout, safeApply, $rootScope) {
    $scope.current_session = null;
    $scope.message_list = [];
    $scope.chat_session_list = [];
    $scope.input_content = "";
    $scope.send_text = function () {
        mqtt.send_text_message(0, $rootScope.my_user_info.realname, 1, $scope.input_content);
        $scope.input_content="";
    };
    $scope.$on('im_chat', function (event, data) {
        // console.log('im_chat data:', data);
        $scope.message_list.push(data);
    });
    $scope.$on('im_chat_session', function (event, data) {
        console.log('im_chat_session data:', data);
    });
    function get_chat_session_user_info(chat_session) {
        chat_session.icon_url = 'http://www.baidu.com';
        var target = chat_session.target;
        var target_type = chat_session.target_type;
        var is_group = (target_type === 1);
        if (is_group) {

        }
        else {
            UserInfo.getUserInfoById(target).then(function (info) {
                safeApply($scope, function () {
                    chat_session.icon_url = icon_default(info.icon_url, info.id, info.realname);
                })
            })
        }
    }

    $scope.select_session = function (session) {
        $scope.current_session = session;
    };
    mqtt.ready(function () {
        mqtt.get_chat_session().then(function (list) {
            $scope.chat_session_list = list;
            _(list).each(function (item) {
                get_chat_session_user_info(item);
            })
        })
    });
});