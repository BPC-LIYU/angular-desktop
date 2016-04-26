service_app
    .factory("api", function (httpReq) {
        var apis = {
            
            'cd': {
                
            },
    
            'chat': {
                
                //  friend_id:好友id
                'add_friend': 'func',
            
                //  talkgroup_id:群id, user_id:用户id
                'add_talkgroup': 'func',
            
                //  talkgroup_id:群id, user_id:用户id
                'add_talkgroup_manager': 'func',
            
                //  content:申请内容, user_id:申请的好友用户id
                'apply_friend': 'func',
            
                //  content:用户内容, talkgroup_id:群id
                'apply_talkgroup': 'func',
            
                //  group_type:群类型, member_ids:成员id列表, name:群名称
                'create_talkgroup': 'func',
            
                //  talkgroup_id:群id
                'dismiss_talkgroup': 'func',
            
                //  talkgroup_id:群id
                'get_talkgroup': 'func',
            
                //  friend_id:好友id, is_black:是否黑名单
                'mark_friend_black': 'func',
            
                //  friend_id:好友id, is_muted:是否免扰
                'mark_friend_muted': 'func',
            
                //  friend_id:好友id, nickname:昵称
                'modefy_friend_nickname': 'func',
            
                //  friendapply_id:好友申请id
                'pass_friendapply': 'func',
            
                //  talkapply_id:入群申请id
                'pass_talkapply': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_black_friend_list': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_friendapply_list': 'func',
            
                //  flag:群成员md5, page_index:页码, page_size:页长度
                'query_group_by_flag_list': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_my_friend_list': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_my_talkgroup_list': 'func',
            
                //  page_index:页码, page_size:页长度, talkgroup_id:群id
                'query_talkgroup_member_list': 'func',
            
                //  talkgroup_id:群id
                'quite_talkgroup': 'func',
            
                //  friendapply_id:好友申请id
                'reject_friendapply': 'func',
            
                //  reply:拒绝理由, talkapply_id:入群申请id
                'reject_talkapply': 'func',
            
                //  talkgroup_id:群id, user_id:用户id
                'remove_talkgroup': 'func',
            
                //  talkgroup_id:群id, user_id:用户id
                'remove_talkgroup_manager': 'func',
            
                //  talkgroup_id:群id, user_id:用户id
                'transfer_talkgroup_manager': 'func',
            
                //  is_muted:是否免打扰, nickname:昵称, talkgroup_id:群id
                'update_info_in_talkgroup': 'func',
            
                //  nickname:昵称, talkgroup_id:群id, user_id:用户id
                'update_nick_in_talkgroup': 'func',
            
            },
    
            'develop': {
                
                //  api_id:接口id
                'get_api': 'func',
            
                //  api_id:接口id
                'get_api_detail': 'func',
            
                //  appinfo_id:应用信息id
                'get_appinfo': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_all_app_list': 'func',
            
                //  app_id:应用id, page_index:页码, page_size:页长度
                'query_api_detail_list': 'func',
            
                //  app_id:应用id, page_index:页码, page_size:页长度
                'query_api_list': 'func',
            
                //  api_id:接口id, page_index:页码, page_size:页长度
                'query_apicomment_list': 'func',
            
                //  api_id:应用id, page_index:页码, page_size:页长度
                'query_appcareuser_list': 'func',
            
                //  page_index:页码, page_size:页长度
                'query_appinfo_list': 'func',
            
            },
    
            'nf': {
                
                //  fileid:文件ID, img_h:图片高度, img_w:图片宽度
                'get_file_url_private': 'func',
            
                //  fileid:文件ID, img_h:图片高度, img_w:图片宽度
                'get_file_url_public': 'func',
            
                //  filename:文件名称, filetype:文件类型, group_type:文件存储类型
                'get_upload_files_url': 'func',
            
                //  fileid:文件ID, org_id:组织, person_id:组织成员, user_id:用户
                'upload_complete': 'func',
            
            },
    
            'org': {
                
            },
    
            'sys': {
                
                //  newpassword:新密码, oldpassword:新密码
                'change_password': 'func',
            
                //  code:验证码, newpassword:新密码, username:手机号
                'change_password_by_code': 'func',
            
                // 
                'check_login': 'func',
            
                // 
                'logout': 'func',
            
                // 
                'my_userinfo': 'func',
            
                // 
                'qrcode_login_check': 'func',
            
                //  cache_key:缓存键, state:逻辑状态
                'qrcode_login_scan': 'func',
            
                // 
                'qrcode_login_string': 'func',
            
                //  code:验证码, email:电子邮箱, password:密码, realname:真实姓名, username:手机号
                'reg_user': 'func',
            
                //  tel:手机号
                'send_sms_code': 'func',
            
                //  tel:手机号
                'send_sms_code_reg': 'func',
            
                //  password: password, username:手机号
                'simple_login': 'func',
            
                // 
                'sync_cookie': 'func',
            
                //  color:颜色, height:高度, text:文字, width:宽度
                'text_icon': 'func',
            
                //  height:高度, id:用户id, realname:姓名, width:宽度
                'user_icon': 'func',
            
            },
    
        };

        function init_api(parents, dic) {
            var url, p;
            _(dic).each(function (value, key) {
                p = parents.slice(0);//数组拷贝
                p.push(key);
                if (value === 'func') {
                    url = "/" + p.join('/');
                    dic[key] = httpReq.bind(null, url);
                }
                else {
                    init_api(p, value);
                }

            })
        }

        init_api([], apis);

        return apis;
    });

