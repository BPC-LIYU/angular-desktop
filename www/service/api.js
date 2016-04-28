service_app
    .factory("api", function (httpReq) {
        var apis = {
            
            'cd': {
                
            },
    
            'chat': {
                
                // 直接添加好友
                //  friend_id:必填:好友id
                'add_friend': 'func',
            
                // 拉人入群
                //  talkgroup_id:必填:群id, user_id:必填:用户id
                'add_talkgroup': 'func',
            
                // 添加管理员
                //  talkgroup_id:必填:群id, user_id:必填:用户id
                'add_talkgroup_manager': 'func',
            
                // 申请添加好友
                //  content:必填:申请内容, user_id:必填:申请的好友用户id
                'apply_friend': 'func',
            
                // 申请入群
                //  content:必填:用户内容, talkgroup_id:必填:群id
                'apply_talkgroup': 'func',
            
                // 创建群
                //  group_type:必填:群类型, member_ids:必填:成员id列表, name:必填:群名称
                'create_talkgroup': 'func',
            
                // 解散群
                //  talkgroup_id:必填:群id
                'dismiss_talkgroup': 'func',
            
                // 查询群信息信息
                //  talkgroup_id:必填:群id
                'get_talkgroup': 'func',
            
                // 设置好友到黑名单
                //  friend_id:必填:好友id, is_black:必填:是否黑名单
                'mark_friend_black': 'func',
            
                // 设置好友免扰
                //  friend_id:必填:好友id, is_muted:必填:是否免扰
                'mark_friend_muted': 'func',
            
                // 修改好友备注名称
                //  friend_id:必填:好友id, nickname:非必填:昵称
                'modefy_friend_nickname': 'func',
            
                // 修改好友申请
                //  friendapply_id:必填:好友申请id
                'pass_friendapply': 'func',
            
                // 通过入群申请
                //  talkapply_id:必填:入群申请id
                'pass_talkapply': 'func',
            
                // 查询黑名单列表
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_black_friend_list': 'func',
            
                // 查询好友申请,分页
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_friendapply_list': 'func',
            
                // 查询群组,根据成员md5值列表
                //  flag:必填:群成员md5, page_index:非必填:页码, page_size:非必填:页长度
                'query_group_by_flag_list': 'func',
            
                // 查询我的好友列表,分页
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_my_friend_list': 'func',
            
                // 查询我的群组列表,分页
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_my_talkgroup_list': 'func',
            
                // 查询群成员列表列表
                //  page_index:非必填:页码, page_size:非必填:页长度, talkgroup_id:必填:群id
                'query_talkgroup_member_list': 'func',
            
                // 退出群
                //  talkgroup_id:必填:群id
                'quite_talkgroup': 'func',
            
                // 拒绝好友申请(删除)
                //  friendapply_id:必填:好友申请id
                'reject_friendapply': 'func',
            
                // 拒绝入群申请
                //  reply:非必填:拒绝理由, talkapply_id:必填:入群申请id
                'reject_talkapply': 'func',
            
                // 踢人出群
                //  talkgroup_id:必填:群id, user_id:必填:用户id
                'remove_talkgroup': 'func',
            
                // 删除管理员
                //  talkgroup_id:必填:群id, user_id:必填:用户id
                'remove_talkgroup_manager': 'func',
            
                // 转让群
                //  talkgroup_id:必填:群id, user_id:必填:用户id
                'transfer_talkgroup_manager': 'func',
            
                // 修改自己的群属性
                //  is_muted:非必填:是否免打扰, nickname:必填:昵称, talkgroup_id:必填:群id
                'update_info_in_talkgroup': 'func',
            
                // 修改群成员昵称
                //  nickname:必填:昵称, talkgroup_id:必填:群id, user_id:必填:用户id
                'update_nick_in_talkgroup': 'func',
            
            },
    
            'develop': {
                
                // 查询接口信息
                //  api_id:必填:接口id
                'get_api': 'func',
            
                // 查询接口详细信息, 带修改历史记录
                //  api_id:必填:接口id
                'get_api_detail': 'func',
            
                // 查询应用信息
                //  appinfo_id:必填:应用信息id
                'get_appinfo': 'func',
            
                // 查询所有的app list信息
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_all_app_list': 'func',
            
                // 查询接口文档详细信息列表带参数
                //  app_id:必填:应用id, page_index:非必填:页码, page_size:非必填:页长度
                'query_api_detail_list': 'func',
            
                // 查询接口文档列表
                //  app_id:非必填:应用id, page_index:非必填:页码, page_size:非必填:页长度
                'query_api_list': 'func',
            
                // 查询接口评论列表
                //  api_id:必填:接口id, page_index:非必填:页码, page_size:非必填:页长度
                'query_apicomment_list': 'func',
            
                // 查询接口关注列表
                //  api_id:必填:应用id, page_index:非必填:页码, page_size:非必填:页长度
                'query_appcareuser_list': 'func',
            
                // 查询接口文档列表
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_appinfo_list': 'func',
            
            },
    
            'nf': {
                
                // 获取文件url
                //  fileid:必填:文件ID, img_h:非必填:图片高度, img_w:非必填:图片宽度
                'get_file_url_private': 'func',
            
                // 获取文件url
                //  fileid:必填:文件ID, img_h:非必填:图片高度, img_w:非必填:图片宽度
                'get_file_url_public': 'func',
            
                // 获取上传文件的url信息
                //  filename:必填:文件名称, filetype:必填:文件类型, group_type:必填:文件存储类型
                'get_upload_files_url': 'func',
            
                // 修改文件的is_active 状态
                //  fileid:必填:文件ID, org_id:非必填:组织, person_id:非必填:组织成员, user_id:非必填:用户
                'upload_complete': 'func',
            
            },
    
            'org': {
                
                // 删除分组主管
                //  group_id:必填:分组id, org_id:必填:组织id, user_id:必填:用户id
                'add_aide_group': 'func',
            
                // 添加应用到组织
                //  app_id:必填:应用id, org_id:必填:组织id
                'add_appinfo': 'func',
            
                // 添加分组主管
                //  group_id:必填:分组id, org_id:必填:组织id, user_id:必填:用户id
                'add_charge_group': 'func',
            
                // 添加管理员
                //  org_id:必填:组织id, user_id:必填:用户id
                'add_manager_org': 'func',
            
                // 分组加人
                //  group_id:必填:分组id, org_id:必填:组织id, user_id:必填:用户id
                'add_person_group': 'func',
            
                // 把用户加入组织,无需申请
                //  org_id:必填:组织id, user_id:必填:用户id
                'add_person_org': 'func',
            
                // 同意加入组织
                //  org_id:必填:组织id, orgapply_id:必填:申请id
                'agree_organization': 'func',
            
                // 申请加入组织
                //  content:必填:申请内容, org_id:必填:组织id
                'apply_organization': 'func',
            
                // 创建分组
                //  group_id:非必填:分组id, name:非必填:分组名称, org_id:必填:组织id
                'create_group': 'func',
            
                // 创建组织
                //  icon_url:非必填:组织头像, name:必填:组织名称
                'create_organization': 'func',
            
                // 查询组织中的未分组成员
                //  group_id:非必填:分组id, org_id:必填:组织id
                'get_org_or_group_contacts': 'func',
            
                // 查询组织信息信息
                //  org_id:必填:组织id
                'get_organization': 'func',
            
                // 从组织中删除应用
                //  app_id:必填:应用id, org_id:必填:组织id, role_id:非必填:角色, user_id:必填:用户id组
                'make_appinfo_permission': 'func',
            
                // 生成登录二维码数值
                //  org_id:必填:组织id
                'qrcode_join_org_string': 'func',
            
                // 查询组织的应用列表
                //  org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度
                'query_appinfo_by_org_list': 'func',
            
                // 查询组织中的分组列表,顶级分组
                //  group_id:必填:分组id, org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度
                'query_group_by_group_list': 'func',
            
                // 查询组织中的分组列表,顶级分组
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_group_by_my_list': 'func',
            
                // 查询组织中的分组列表,顶级分组
                //  org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度
                'query_group_by_org_list': 'func',
            
                // 查询分组成员列表
                //  group_id:必填:分组id, org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度
                'query_member_by_group_list': 'func',
            
                // 查询我的组织列表
                //  page_index:非必填:页码, page_size:非必填:页长度
                'query_my_org_list': 'func',
            
                // 查询组织的应用列表
                //  org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度
                'query_not_used_appinfo_by_org_list': 'func',
            
                // 查询应用的角色列表
                //  app_ids:必填:应用id, page_index:非必填:页码, page_size:非必填:页长度
                'query_role_by_apps_list': 'func',
            
                // 查询用户对应应用的权限列表
                //  app_ids:必填:应用id, org_id:必填:组织id, page_index:非必填:页码, page_size:非必填:页长度, user_ids:必填:用户id
                'query_user_permissions_list': 'func',
            
                // 拒绝加入组织
                //  org_id:必填:组织id, orgapply_id:必填:申请id
                'reject_organization': 'func',
            
                // 删除分组主管
                //  group_id:必填:分组id, org_id:必填:组织id
                'remove_aide_group': 'func',
            
                // 从组织中删除应用
                //  app_id:必填:应用id, org_id:必填:组织id
                'remove_appinfo': 'func',
            
                // 删除分组主管
                //  group_id:必填:分组id, org_id:必填:组织id
                'remove_charge_group': 'func',
            
                // 删除分组
                //  group_id:必填:分组id, org_id:必填:组织id
                'remove_group': 'func',
            
                // 移除管理员
                //  org_id:必填:组织id, user_id:必填:用户id
                'remove_manager_org': 'func',
            
                // 分组加人
                //  group_id:必填:分组id, org_id:必填:组织id, user_id:必填:用户id
                'remove_person_group': 'func',
            
                // 把用户移出组织
                //  org_id:必填:组织id, user_id:必填:用户id
                'remove_person_org': 'func',
            
                // 添加新的超级管理员
                //  org_id:必填:组织id, user_id:必填:用户id
                'transfer_manager_org': 'func',
            
                // 修改分组的信息
                //  group_id:必填:分组id, icon_url:非必填:头像, name:非必填:分组名称, org_id:必填:组织id, parent_id:非必填:父级分组id
                'update_group': 'func',
            
                // 查询组织信息信息
                //  icon_url:非必填:组织头像, name:必填:组织名称, org_id:必填:组织id
                'update_organization': 'func',
            
                // 修改组织成员信息
                //  email:非必填:电子邮件, is_gaoguan:非必填:是否高管, is_show_email:非必填:是否显示邮箱, is_show_tel:非必填:是否显示手机号, org_id:必填:组织id, realname:非必填:姓名, title:非必填:职务, user_id:必填:用户id
                'update_person_group': 'func',
            
            },
    
            'sys': {
                
                // 通过原密码修改新密码
                //  newpassword:必填:新密码, oldpassword:必填:新密码
                'change_password': 'func',
            
                // 通手机验证码修改密码
                //  code:必填:验证码, newpassword:必填:新密码, username:必填:手机号
                'change_password_by_code': 'func',
            
                // 检查是否登录
                // 
                'check_login': 'func',
            
                // 退出账号
                // 
                'logout': 'func',
            
                // 获取我的个人信息
                // 
                'my_userinfo': 'func',
            
                // sessionid 在成功后返回给 客户端
                // 
                'qrcode_login_check': 'func',
            
                // 扫码登录
                //  cache_key:必填:缓存键, state:必填:逻辑状态
                'qrcode_login_scan': 'func',
            
                // 生成登录二维码数值
                // 
                'qrcode_login_string': 'func',
            
                // 注册用户
                //  code:必填:验证码, email:非必填:电子邮箱, password:必填:密码, realname:必填:真实姓名, username:必填:手机号
                'reg_user': 'func',
            
                // 发送修改密码的验证码
                //  tel:必填:手机号
                'send_sms_code': 'func',
            
                // 注册发送验证码
                //  tel:必填:手机号
                'send_sms_code_reg': 'func',
            
                // 简单登录,只返回 sessionid
                //  password:必填: password, username:必填:手机号
                'simple_login': 'func',
            
                // 同步cookie
                // 
                'sync_cookie': 'func',
            
                // 获取文本组合的头像
                //  color:必填:颜色, height:非必填:高度, text:必填:文字, width:非必填:宽度
                'text_icon': 'func',
            
                // 获取用户头像
                //  height:非必填:高度, id:必填:用户id, realname:必填:姓名, width:非必填:宽度
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

