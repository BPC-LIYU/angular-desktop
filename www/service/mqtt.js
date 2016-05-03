/**
 * Created by fanjunwei on 16/4/27.
 */
service_app
    .provider("mqtt", function () {
        /**
         * 右侧弹出框
         */

        this.config = {
            host: '',
            client_type: ''
        };
        this.set = function (config) {
            angular.extend(this.config, config);
        };
        this.$get = function ($q, $rootScope, $injector) {
            var safeApply = $injector.get('safeApply');
            var self = this;
            var client;
            var request_callback_map = {};
            var state_defered_array = [];
            var state = 0;//0:未登录 1:已登录 -1:错误

            function cleanup() {
                if (client) {
                    client.end();
                    client = null;
                }
                request_callback_map = {};
                state = 0;
            }

            function handle_event(topic_type, object) {
                var event_type = object.event_type;
                var event_obj = object.event_obj;
                if (event_type === 'login_error') {
                    console.error(event_obj.message);
                    if (event_obj.code === 501) {
                        cleanup();
                    }
                }
                else if (event_type === 'kick') {
                    console.error(event_obj.message);
                    cleanup();
                    safeApply($rootScope, function () {
                        $rootScope.$broadcast('im_kick');
                    })
                }else{
                    safeApply($rootScope, function () {
                        $rootScope.$broadcast(event_type, event_obj);
                    })
                }
            }

            function handle_request(object) {
                var callback_id = object.callback_id;
                var result = object.result;
                var cb = request_callback_map[callback_id];
                if (cb) {
                    request_callback_map[callback_id] = null;
                    cb(result);
                }
            }

            function handle_chat(object) {
                safeApply($rootScope, function () {
                    $rootScope.$broadcast('im_chat', object);
                })

            }

            function handle_chat_session(object) {
                safeApply($rootScope, function () {
                    $rootScope.$broadcast('im_chat_session', object);
                })

            }

            function init() {
                client.on('connect', function (args) {
                    console.log("mqtt connect");
                    state = 1;
                    _(state_defered_array).each(function (defered) {
                        defered.resolve();
                    });
                    request("send_client_info", {
                        client_type: self.config.client_type,
                        device_id: self.config.device_id
                    })
                });
                client.on('error', function (error) {
                    console.error(error);
                    _(state_defered_array).each(function (defered) {
                        defered.reject();
                    });
                    state = -1;
                });
                client.on('message', function (topic, message) {
                    if (topic.indexOf('user/') === 0) {
                        message = JSON.parse(message.toString());
                        console.log('--user', topic, message);
                        if (message.type === 'event') {
                            handle_event('user', message.obj);
                        }
                        else if (message.type === 'request') {
                            handle_request(message.obj);
                        }
                        else if (message.type === 'chat') {
                            handle_chat(message.obj);
                        }
                        else if (message.type === 'chat_session') {
                            handle_chat_session(message.obj);
                        }

                    }
                    else if (topic.indexOf('group/') === 0) {
                        message = JSON.parse(message.toString());
                        console.log('--group', topic, message);
                        if (message.type === 'event') {
                            handle_event('group', message.obj);
                        }
                        else if (message.type === 'chat') {
                            handle_chat(message.obj);
                        }
                        else if (message.type === 'chat_session') {
                            handle_chat_session(message.obj);
                        }
                    }

                });
            }


            function login(user_id, username, password) {
                cleanup();
                var config = self.config;
                config.user_id = user_id;
                config.username = username;
                config.password = password;
                client = mqtt.connect(self.config.host, {
                    clean: false,
                    clientId: config.client_type + "_" + config.user_id,
                    username: config.username,
                    password: config.password
                });
                init();
            }

            function ready(cb) {
                if (state === 1) {
                    cb(true);
                }
                else if (state === -1) {
                    cb(false);
                }
                else {
                    var defered = $q.defer();
                    state_defered_array.push(defered);
                    defered.promise.then(function () {
                        cb(true);
                    }, function () {
                        cb(false);
                    })
                }
            }

            function logout() {
                cleanup();
            }

            function request(route, parms, cb) {
                if (client) {
                    var callback_id = null;
                    if (cb) {
                        callback_id = self.config.client_type + "_" + self.config.user_id + "_" + (new Date).valueOf();
                    }
                    var payload = {
                        callid: callback_id,
                        route: route,
                        parms: parms
                    };
                    if (cb) {
                        request_callback_map[callback_id] = cb;
                    }
                    client.publish("request/" + self.config.user_id, JSON.stringify(payload), {qos: 0, retain: false});
                }
            }

            /*
             var send_user_message={
             target_type: 0, //目标类型 0:单聊 1:群聊
             target: 1, //目标id
             ctype: 'txt', //消息类型:txt:文字消息；file：附件消息；location：地理位置消息；vcard：名片消息；href：超链接消息；oa：oa消息;
             content: 'json', //内容
             ext: 'json', //扩展字段
             id_client: 1, //客户端提供的id
             push_content: '', //推送通知时显示的内容
             push_payload: 'json', //推送通知时显示的自定义字段
             is_push: 1, //是否推送
             is_unreadable: 1 //是否计入未读数
             }
             */
            function send_text_message(target_type, fname, target, text, ext) {
                var message = {
                    fname: fname,
                    target_type: target_type, //目标类型 0:单聊 1:群聊
                    target: target, //目标id
                    ctype: 'txt', //消息类型:txt:文字消息；file：附件消息；location：地理位置消息；vcard：名片消息；href：超链接消息；oa：oa消息;
                    content: {
                        text: text
                    }, //内容
                    ext: ext, //扩展字段
                    id_client: (new Date()).valueOf(), //客户端提供的id
                    push_content: text, //推送通知时显示的内容
                    push_payload: ext, //推送通知时显示的自定义字段
                    is_push: true, //是否推送
                    is_unreadable: true //是否计入未读数
                };
                request('send_message', message);
            }

            function get_chat_session() {
                var defered = $q.defer();
                request('get_chat_session', {}, function (list) {
                    defered.resolve(list);
                });
                return defered.promise;
            }

            function set_chat_session_read_time(session_id, time) {
                request('set_chat_session_read_time', {session_id: session_id, time: time});
            }

            function get_chat_history(session_id, last_time) {
                var defered = $q.defer();
                request('get_chat_history', {session_id: session_id, last_time: last_time}, function (result) {
                    defered.resolve(result);
                });
                return defered.promise;
            }

            return {
                login: login,
                ready: ready,
                logout: logout,
                request: request,
                send_text_message: send_text_message,
                get_chat_session: get_chat_session,
                set_chat_session_read_time: set_chat_session_read_time,
                get_chat_history: get_chat_history
            }
        }

    });
