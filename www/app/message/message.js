/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('messageCtrl', function ($scope, httpReq, mqtt, UserInfo, icon_default, $timeout, safeApply, $rootScope, update_array, IM) {
    $scope.current_session = null;
    $scope.message_list = [];
    $scope.chat_session_list = [];
    $scope.input_content = "";
    $scope.scroll_down = true;
    var args;

    function main() {

        mqtt.ready(function () {
            mqtt.get_chat_session().then(function (list) {
                $scope.chat_session_list = list;
                _(list).each(function (item) {
                    get_chat_session_user_info(item);
                })

                args = IM.get_args_and_clean();
                if (args) {
                    if (args.action === 'go_chat') {
                        var is_group = (args.target_type === 1);
                        var session = _($scope.chat_session_list).find(function (item) {
                            return item.target_type === args.target_type && item.target === args.target;
                        });
                        if (!session) {
                            var session_id;
                            if (is_group) {
                                session_id = $rootScope.my_user_info.id + "_g_" + args.target;
                            }
                            else {
                                session_id = $rootScope.my_user_info.id + "_p_" + args.target;
                            }
                            session = {
                                session_id: session_id, //每个会话一个id：好友会话[user_id]_p_[user_id] : 群会话[user_id]_g_[group_id]：系统会话[user_id]_s_[sys_id]
                                owner: $rootScope.my_user_info.id, //用户id
                                target: args.target, //聊天对象id
                                target_type: args.target_type, //聊天对象类型
                                last_message_time: (new Date()).valueOf()
                            };
                            get_chat_session_user_info(session);
                            $scope.chat_session_list.splice(0, 0, session);
                        }
                        $scope.select_session(session);

                    }
                }
            })
        });

    }

    main();

    $scope.send_text = function () {
        var fname;
        var target_type = $scope.current_session.target_type;
        var is_group = (target_type === 1);
        if (is_group) {

        }
        else {
            fname = $rootScope.my_user_info.realname
        }
        var target = $scope.current_session.target;
        mqtt.send_text_message(target_type, fname, target, $scope.input_content);
        $scope.input_content = "";
    };
    $scope.$on('im_chat', function (event, data) {
        // console.log('im_chat data:', data);
        var target_type = data.target_type;
        var is_group = (target_type === 1);
        if (is_group) {
            if ($scope.current_session && data.target === $scope.current_session.target) {
                $scope.message_list.push(data);
                mqtt.set_chat_session_read_time($scope.current_session.session_id, data.time);
            }
            else {
                var find = _($scope.chat_session_list).find(function (item) {
                    return item.target === data.target;
                });
                if (find) {
                    find.unread += 1;
                }
            }
        }
        else {
            if ($scope.current_session && data.fuser === $scope.current_session.target) {
                $scope.message_list.push(data);
                mqtt.set_chat_session_read_time($scope.current_session.session_id, data.time);
            }
            else if ($scope.current_session && data.target === $scope.current_session.target) {
                $scope.message_list.push(data);
            }
            else {
                var find = _($scope.chat_session_list).find(function (item) {
                    return item.target === data.fuser;
                });
                if (find) {
                    find.unread += 1;
                }
            }
        }


    });
    $scope.$on('im_chat_session', function (event, data) {

        update_array($scope.chat_session_list, [data], function (item1, item2) {
            return item1.session_id === item2.session_id;
        });
        console.log('im_chat_session data:', $scope.chat_session_list);
    });
    $scope.$on('im_delete_chat_session', function (event, data) {
        $scope.chat_session_list = _($scope.chat_session_list).filter(function (item) {
            return item.session_id != data.session_id;
        });
        if (data.session_id === $scope.current_session.session_id) {
            $scope.current_session = null;
        }
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
                    if (!chat_session.name) {
                        chat_session.name = info.realname;
                    }
                })
            })
        }
    }

    $scope.select_session = function (session) {
        if (session !== $scope.current_session) {
            $scope.current_session = session;
            session.unread = 0;
            mqtt.set_chat_session_read_time(session.session_id, session.last_message_time);
            mqtt.get_chat_history(session.session_id).then(function (messages) {
                $scope.message_list = messages;
            });
        }

    };

    $scope.delete_session = function ($event, session) {
        $event.stopPropagation();
        mqtt.delete_chat_session(session.target, session.target_type);
    }
    function load_more_history() {
        $scope.scroll_down = false;
        var last_time = null;
        if ($scope.message_list.length > 0) {
            last_time = $scope.message_list[0].time;
        }
        $scope.scroll_down = false;
        mqtt.get_chat_history($scope.current_session.session_id, last_time).then(function (messages) {
            $scope.message_list.splice.bind($scope.message_list, 0, 0).apply(null, messages);

            // $scope.scroll_down = true;
        });
    }

    $scope.scroll = function (top) {
        if (top < 50) {
            load_more_history();
        }
    }

});