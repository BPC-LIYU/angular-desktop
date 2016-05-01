/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('messageCtrl', function ($scope, httpReq, mqtt, UserInfo, icon_default, $timeout, safeApply, $rootScope, update_array) {
    $scope.current_session = null;
    $scope.message_list = [];
    $scope.chat_session_list = [];
    $scope.input_content = "";
    $scope.send_text = function () {
        mqtt.send_text_message(0, $rootScope.my_user_info.realname, 1, $scope.input_content);
        $scope.input_content = "";
    };
    $scope.$on('im_chat', function (event, data) {
        // console.log('im_chat data:', data);

        if ($scope.current_session && data.fuser === $scope.current_session.target) {
            $scope.message_list.push(data);
            mqtt.set_chat_session_read_time($scope.current_session.session_id, data.time);
        }
        else {
            var find = _($scope.chat_session_list).find(function (item) {
                return item.target === data.fuser;
            });
            if (find) {
                find.unread += 1;
            }
        }

    });
    $scope.$on('im_chat_session', function (event, data) {

        update_array($scope.chat_session_list, [data], function (item1, item2) {
            return item1.session_id === item2.session_id;
        });
        console.log('im_chat_session data:', $scope.chat_session_list);
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
        session.unread = 0;
        mqtt.set_chat_session_read_time(session.session_id, session.last_message_time);
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