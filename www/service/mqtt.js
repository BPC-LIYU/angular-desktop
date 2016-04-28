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
        this.$get = function ($q, $uibModal, $rootScope, $injector) {
            var self = this;
            var client;
            var request_callback_map = {};

            function cleanup() {
                if (client) {
                    client.end();
                    client = null;
                }
                request_callback_map = {};
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
                    $rootScope.$broadcast('im_kick');
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
                $rootScope.$broadcast('im_chat', object);
            }

            function init() {
                client.on('connect', function () {
                    console.log("mqtt connect");
                    request("send_client_info", {
                        client_type: self.config.client_type,
                        device_id: self.config.device_id
                    })
                });
                client.on('error', function (error) {
                    console.error(error);
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

            return {
                login: login,
                logout: logout,
                request: request,
                send_text_message: send_text_message
            }
        }

    });
