var service_app = angular.module('desktop.services', ['ngCookies'])
  .service("showMessage", function ($ionicPopup, $q) {
    return function (title, message) {
      /**
       *meessageBox
       by: 范俊伟 at:2015-06-12
       */
      var defered = $q.defer();
      $ionicPopup.confirm({
        title: title,
        template: message,
        buttons: [
          {
            text: '确定',
            type: 'button-positive',
            onTap: function () {
              defered.resolve();
            }
          }
        ]
      });
      return defered.promise;
    }
  })
  /**
   * 城市选择
   by: 范俊伟 at:2016-02-18
   */
  .service("cityPicker", function ($q) {
    return function () {
      var defered = $q.defer();
      ttjd.choose_city(function (data) {
        defered.resolve(parseInt(data.city));
      }, function () {
        defered.reject();
      });
      return defered.promise;
    }
  })
  /**
   *meessageBox
   by: 范俊伟 at:2015-06-12
   */
  .service("showConfirm", function ($ionicPopup, $q) {
    return function (title, message) {
      var defered = $q.defer();
      $ionicPopup.confirm({
        title: title,
        template: message,
        buttons: [
          {
            text: '取消',
            onTap: function () {
              defered.reject();
            }
          },
          {
            text: '确定',
            type: 'button-positive',
            onTap: function () {
              defered.resolve();
            }
          }
        ]
      });
      return defered.promise;
    }
  })
  /**
   * kv存储
   by: 范俊伟 at:2016-02-18
   */
  .factory('Store', function ($q, $cookieStore, $timeout) {
    return {
      set: function (key, value) {
        var deferred = $q.defer();
        $timeout(function () {
          try {
            window.localStorage.setItem(key, value);
          }
          catch (e) {
          }
          try {
            $cookieStore.put(key, value);
          }
          catch (e) {
          }
          deferred.resolve();
        }, 0);
        return deferred.promise;
      },
      get: function (key) {
        var deferred = $q.defer();
        $timeout(function () {
          var value = null;
          try {
            if (value == null) {
              value = window.localStorage.getItem(key);
            }
          } catch (e) {
          }
          try {
            if (value == null) {
              value = $cookieStore.get(key);
            }
          } catch (e) {
          }

          deferred.resolve(value);
        }, 0);
        return deferred.promise;
      },
      remove: function (key) {
        var deferred = $q.defer();
        $timeout(function () {
          try {
            window.localStorage.removeItem(key);
          }
          catch (e) {
          }
          try {
            $cookieStore.remove(key);
          }
          catch (e) {
          }
          deferred.resolve();
        }, 0);
        return deferred.promise;
      }
    };
  })
  /**
   * 处理接口状态码
   by: 范俊伟 at:2016-02-18
   */
  .service("globalStateCheck", function ( $state, $injector) {
    return function globalStateCheck(data) {
      /**
       * 全局错误状态码检测,返回true则继续进行其他处理
       * by:范俊伟 at:2015-01-21
       * 显示成功信息
       by: 范俊伟 at:2015-04-23
       不显示成功信息
       by: 范俊伟 at:2015-06-12
       */
      var Auth = $injector.get('Auth');
      if (data.status_code == 1) {
        Auth.logout();
        return false;
      }
      return true;

    }
  })
  /**
   * toast提示显示
   by: 范俊伟 at:2016-02-18
   */
  .service("showToast", function ($ionicLoading) {
    return function (message) {
      /**
       * toast
       * by:范俊伟 at:2015-01-22
       */
      $ionicLoading.show({template: message, noBackdrop: true, duration: 2000});
    }
  })
  /**
   * 转化城市数据
   by: 范俊伟 at:2016-02-18
   */
  .service("formatCityByID", function () {
    return function (id) {
      var city_list = city_data.city_list;
      for (var i = 0; i < city_list.length; i++) {
        var city = city_list[i];
        if (city.city_id == id) {
          return city.province_name + ' ' + city.city_name;
        }
      }
      return '';
    }
  })
  /**
   * 显示错误信息
   by: 范俊伟 at:2016-02-18
   */
  .service("showErrorMessage", function (showMessage, showToast) {
    return function (data) {
      /**
       * 通用错误信息显示
       * by:范俊伟 at:2015-01-22
       * 判断在有message的情况下再提示错误信息
       by: 范俊伟 at:2015-03-08
       修改meessageBox调用
       by: 范俊伟 at:2015-06-12
       */
      if (!data.success) {
        if (data.message) {
          if (data.dialog == 0) {
            showToast(data.message);
          }
          else {
            showMessage('错误', data.message);
          }
        }
      }
    }
  })
  /**
   * 获取二维码
   by: 范俊伟 at:2016-02-18
   */
  .service("getQrcode", function ($q, $timeout) {
    var self = this;
    return function (text) {
      /**
       * 通用http请求函数
       by: 范俊伟 at:2015-03-10
       */
      var deferred = $q.defer();
      var qr_parms = {};
      qr_parms['text'] = text;
      var qr_url = ttjd_config.base_url + "/ns/sys/get_qrcode?" + $.param(qr_parms);
      $timeout(function () {
        deferred.resolve(qr_url);
      }, 0);
      return deferred.promise;
    }
  })
  .service("buildQrcodeArgs", function (getQrcode, $q) {
    var self = this;
    return function (parms) {
      /**
       * 编码二维码参数
       by: 范俊伟 at:2015-03-10
       */
      var get_args = {'p': parms.join('|')};
      return window.ttjd_config.base_url + "/ns/qrcode2?" + $.param(get_args);
    }
  })
  /**
   * 通用网路请求
   by: 范俊伟 at:2016-02-18
   */
  .service("httpReq", function ($http, $q, globalStateCheck, showErrorMessage, $injector, showToast, $ionicLoading, $timeout) {
    var self = this;
    var Store = $injector.get('Store');
    var parseURL = $injector.get('parseURL');
    var result_map = {};
    var last_cache_key;
    return function (url, data, option) {
      /**
       * 通用http请求函数
       by: 范俊伟 at:2015-03-10
       */
      var cache_key;
      if (!option) {
        option = {};
      }
      var method = option.method;
      var notShowErrorMessage = option.no_error;
      var cache = option.cache;
      var wait = option.wait;
      if (method === undefined) {
        method = 'POST';
      }
      var deferred = $q.defer();
      url = ttjd_config.base_url + url;
      var parmss = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: url,
        method: method
      };
      if (!data) {
        data = {};
      }
      Store.get("ttjd_sessionid").then(function (sessionid) {
        var urlp = parseURL(window.location.href);
        var local_host = urlp.host + ":" + urlp.port;
        var urlp = parseURL(url);
        var req_host = urlp.host + ":" + urlp.port;
        if (sessionid && local_host != req_host) {
          parmss.headers['sessionid'] = sessionid;
        }
        if (data) {
          parmss['data'] = $.param(data);
        }
        if (cache || wait) {
          cache_key = md5(url + JSON.stringify(data));
        }
        if (cache) {
          if (result_map[cache_key]) {
            deferred.resolve(result_map[cache_key]);
          }
        }
        if (wait) {
          if (last_cache_key == cache_key) {
            deferred.reject();
            return;
          }
          last_cache_key = cache_key;
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>',
            noBackdrop: true
          });
        }
        $http(parmss).success(
          function (data, status, headers, config) {

            if (globalStateCheck(data)) {
              if (notShowErrorMessage) {
                if (cache) {
                  result_map[cache_key] = data;
                }
                deferred.resolve(data);
              }
              else {
                if (data.success) {
                  if (cache) {
                    result_map[cache_key] = data;
                  }
                  deferred.resolve(data);
                }
                else {
                  $timeout(function () {
                    showErrorMessage(data);
                  });
                  deferred.reject(null, data);
                }
              }
            }
            else {
              deferred.reject(null, data);
            }
          }
        ).error(function (data, status, headers, config) {
          showToast('网络异常');
          deferred.reject(null, data);
        });
      });
      var promise = deferred.promise;
      if (wait) {
        promise.then(function () {
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        });
      }
      return promise;
    }
  })
  .service("readFile", function ($http, $q) {
    return function (url) {
      /**
       * 读取本地文件
       by: 范俊伟 at:2015-03-10
       */
      var deferred = $q.defer();
      $http.get(url).success(
        function (data, status, headers, config) {
          deferred.resolve(data);
        }
      ).error(function (data, status, headers, config) {
        deferred.reject(null, data);
      });
      return deferred.promise;
    }
  })
  .factory('myUserInfo', function ($q, httpReq) {

    var user_info = null;

    function getUserInfo() {
      var deferred = $q.defer();
      if (user_info) {
        deferred.resolve(user_info);
      }
      httpReq("/ns/user/my_userinfo").then(function (data) {
        user_info = data.result;
        deferred.resolve(user_info);
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      clear: function () {
        user_info = null;
      },
      getUserInfo: function () {
        return getUserInfo();
      },
      getHxusername: function () {
        if (user_info) {
          return user_info.hxusername;
        }
        else {
          return null;
        }
      },
      getHxpassword: function () {
        if (user_info) {
          return user_info.hxpassword;
        }
        else {
          return null;
        }
      },
      getName: function () {
        if (user_info) {
          return user_info.name;
        }
        else {
          return null;
        }
      },
      getRealname: function () {
        if (user_info) {
          return user_info.realname;
        }
        else {
          return null;
        }
      },
      getUid: function () {
        if (user_info) {
          return user_info.id;
        }
        else {
          return null;
        }
      }
    };
  })
  .service("SelectImage", function ($q, $ionicActionSheet) {
    var self = this;
    return function (max_count, has_camera, has_piclib, title) {
      /**
       * max_count:最大选择图片数,0为无限制
       * has_camera:是否可以拍照
       * has_piclib:是否可以选择相册
       * @type {string}
       */
      function camera_take_photo() {
        var deferred = $q.defer();
        navigator.camera.getPicture(function (imageURI) {
          var result = {type: 0, images: [imageURI]};
          deferred.resolve(result);
        }, function () {
          deferred.reject();
        }, {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 640,
          quality: 60
        });
        return deferred.promise;
      }

      function select_picture_library() {
        var deferred = $q.defer();
        var option = {
          width: 640,
          quality: 60
        };
        if (max_count && max_count > 0) {
          option['maximumImagesCount'] = max_count;
        }
        window.imagePicker.getPictures(
          function (results) {
            if (results && results.length) {
              var result = {type: 1, images: results};
              deferred.resolve(result);
            }
            else {
              deferred.reject();
            }
          }, function (error) {
            deferred.reject();
          }, option
        );
        return deferred.promise;
      }

      if (has_camera && has_piclib) {
        var deferred = $q.defer();
        $ionicActionSheet.show({
          buttons: [
            {text: '拍照'},
            {text: '从相册选择'}
          ],
          titleText: title,
          cancelText: '取消',
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                camera_take_photo().then(function (data) {
                  deferred.resolve(data);
                }, function () {
                  deferred.reject();
                });
                return true;
              case 1:
                select_picture_library().then(function (data) {
                  deferred.resolve(data);
                }, function () {
                  deferred.reject();
                });
                return true;
            }
          }
        });
        return deferred.promise;
      }
      else if (has_camera) {
        return camera_take_photo();
      }
      else if (has_piclib) {
        return select_picture_library();
      }
    }
  })
  .service("runFuncArray", function ($q) {

    return function (func_array) {
      var deferred = $q.defer();
      deferred.resolve();
      var promise = deferred.promise;
      for (var i = 0; i < func_array.length; i++) {
        promise = promise.then(func_array[i]);
      }
      return promise;
    }
  })
  .service("UploadFiles", function ($q, httpReq, runFuncArray, $ionicLoading) {

    return function (urls, group_type) {
      var deferred = $q.defer();
      if (!urls || urls.length == 0) {
        deferred.resolve([]);
        return deferred.promise;
      }
      var file_ids = [];
      var func_array = [];

      function func_factory(fileURL) {
        return function () {
          var deferred = $q.defer();
          var filename = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          var ldot = filename.lastIndexOf(".");
          var filetype = filename.substring(ldot + 1);
          httpReq("/nf/get_upload_files_url", {
            group_type: group_type,
            filename: filename,
            filetype: filetype
          }).then(function (data) {
            var fileid = data.result.fileid;
            var posturl = data.result.posturl;
            var params = data.result.params;


            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = filename;
            options.mimeType = "application/octet-stream";
            options.params = params;
            var ft = new FileTransfer();
            ft.upload(fileURL, posturl, function (response) {
              if (response.responseCode == 200) {
                file_ids.push(fileid);
              }
              deferred.resolve();
            }, function (error) {
              deferred.resolve();
            }, options);
          }, function () {
            deferred.resolve();
          });
          return deferred.promise;
        }
      }

      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>',
        noBackdrop: true
      });
      for (var i = 0; i < urls.length; i++) {
        func_array.push(func_factory(urls[i]));
      }
      runFuncArray(func_array).then(function () {
        $ionicLoading.hide();
        deferred.resolve(file_ids);
      });

      return deferred.promise;
    }
  })
  .service("Video", function ($q, $ionicActionSheet) {
    var self = this;
    return function (duration) {
      /**
       * 录制视频
       * duration:持续时间
       * @type {string}
       */
      var deferred = $q.defer();
      var captureSuccess = function (mediaFiles) {
        var path = mediaFiles[0].fullPath;
        deferred.resolve(path);
      };
      var captureError = function (error) {
        deferred.reject();
      };
      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1, duration: duration});
      return deferred.promise;

    }
  })
  .service("FormatFileSize", function () {
    return function (size) {
      /**
       * 文件大小返回优化
       * by: 魏璐 at:2016-01-08
       */
      if (size == 0) {
        return '未知大小'
      }
      if (size / 1024 < 1024) {
        return (size / 1024).toFixed(2) + 'K'
      } else if (size / 1024 / 1024 < 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'M'
      } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'G'
      }
    }
  })
  .factory('HxUserInfo', function ($q, httpReq) {
    var user_info_map_by_hx_usename = {};

    function getByHxUsername(hxusername) {
      var deferred = $q.defer();
      if (user_info_map_by_hx_usename[hxusername]) {
        deferred.resolve(user_info_map_by_hx_usename[hxusername]);
      }
      httpReq("/ns/user/get_userinfo_by_hxusername", {hxusername: hxusername}, {no_error: true}).then(function (data) {
        if (data.success) {
          user_info_map_by_hx_usename[hxusername] = data.result;
          deferred.resolve(data.result);
        } else {
          deferred.reject({person_delete: true});
        }
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      getByHxUsername: function (hxusername) {
        return getByHxUsername(hxusername);
      }
    }
  })
  .service("SubStrLen", function () {
    /**
     * 截取字符串
     * by: 魏璐 at:2016-01-19
     */
    return function (str, len, isellipsis) {
      var ellipsis = '……';
      if (isellipsis == 1) {
        ellipsis = '';
      }
      if (!str) {
        return "";
      }
      if (str.length > len) {
        return str.substr(0, len) + ellipsis;
      } else {
        return str;
      }
    }
  })
  .service("Getuuid", function () {
    /**
     * 获取随机串
     * by: 魏璐 at:2016-01-19
     */
    return function () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "_";

      var uuid = s.join("");
      return uuid;
    }
  })
  .service("DatePicker", function ($q) {
    return function (type, defaultvalue) {
      var deferred = $q.defer();
      var date = new Date();
      if (defaultvalue) {
        date = new Date(defaultvalue);
      }
      if (type == 'time') {
        datePicker.show({mode: "time", date: date}, function (data) {
          deferred.resolve(data);
        }, function () {
          deferred.reject();
        });
      } else {
        datePicker.show({mode: "date", date: date}, function (data) {
          deferred.resolve(data);
        }, function () {
          deferred.reject();
        });
      }
      return deferred.promise;
    }
  })
  .factory('UserInfo', function ($q, httpReq) {

    var user_info_map_by_id = {};
    var user_info_map_by_hx_usename = {};

    function getUserInfoById(id) {
      var deferred = $q.defer();
      if (user_info_map_by_id[id]) {
        deferred.resolve(user_info_map_by_id[id]);
      }
      httpReq("/ns/project/get_userinfo", {user_id: id}).then(function (data) {
        user_info_map_by_id[id] = data.result;
        user_info_map_by_hx_usename[data.hxusername] = data.result;
        deferred.resolve(data.result);
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

    function getUserInfoByTel(tel) {
      var deferred = $q.defer();
      httpReq("/ns/project/get_userinfo", {tel: tel}).then(function (data) {
        deferred.resolve(data.result);
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

    function getUserInfoByHxUsername(hxusername) {
      var deferred = $q.defer();
      if (user_info_map_by_hx_usename[hxusername]) {
        deferred.resolve(user_info_map_by_hx_usename[hxusername]);
      }
      else {
        httpReq("/ns/project/get_userinfo", {hxusername: hxusername}).then(function (data) {
          user_info_map_by_id[data.id] = data.result;
          user_info_map_by_hx_usename[data.hxusername] = data.result;
          deferred.resolve(data.result);
        }, function () {
          deferred.reject();
        });
      }
      return deferred.promise;
    }

    return {
      getUserInfoById: function (id) {
        return getUserInfoById(id);
      },
      getUserInfoByTel: function (tel) {
        return getUserInfoByTel(tel);
      },
      getUserInfoByHxUsername: function (hxusername) {
        return getUserInfoByHxUsername(hxusername);
      }
    }
  })
  .factory('hxGroupInfo', function ($q, httpReq) {

    var hxGroup_info_map_by_id = {};
    var hxGroup_info_map_by_hx_groupname = {};

    function getHxGroupInfoById(id) {
      var deferred = $q.defer();
      if (hxGroup_info_map_by_id[id]) {
        deferred.resolve(hxGroup_info_map_by_id[id]);
      }
      else {
        httpReq("/ns/hxgroup/get_hxgroup_info", {id: id}, {notShowErrorMessage: true}).then(function (data) {
          hxGroup_info_map_by_id[data.id] = data.result;
          hxGroup_info_map_by_hx_groupname[data.hxgroupid] = data.result;
          deferred.resolve(data.result);
        }, function () {
          deferred.reject();
        });
      }
      return deferred.promise;
    }

    function getHxGroupInfoByHxUsername(hxgroupname) {
      var deferred = $q.defer();
      if (hxGroup_info_map_by_hx_groupname[hxgroupname]) {
        deferred.resolve(hxGroup_info_map_by_hx_groupname[hxgroupname]);
      }
      httpReq("/ns/hxgroup/get_hxgroup_info_by_hx", {hxgroupid: hxgroupname}, {
        notShowErrorMessage: true,
        no_error: true
      }).then(function (data) {
        //alert(JSON.stringify(data));
        if (data.success) {
          hxGroup_info_map_by_id[data.id] = data.result;
          hxGroup_info_map_by_hx_groupname[hxgroupname] = data.result;
          deferred.resolve(data.result);
        } else {
          deferred.reject({group_delete: true});
        }
      }, function () {
        deferred.reject();
      });

      return deferred.promise;
    }

    return {
      getHxGroupInfoById: function (id) {
        return getHxGroupInfoById(id);
      },
      getHxGroupInfoByHxUsername: function (hxgroupname) {
        return getHxGroupInfoByHxUsername(hxgroupname);
      }
    };
  })
  .service("format_datetime", function () {
    return function (str) {
      /**
       * 格式化列表时间
       */
      if (!str || str == "") {
        return "";
      }
      var datetime = moment(str);
      var now = moment();
      if (now < datetime) {
        return datetime.format('HH:mm');
      }
      if (datetime.year() != now.year()) {
        return datetime.format('YYYY-MM-DD');
      }
      else if (datetime.dayOfYear() - now.dayOfYear() > 2) {
        return datetime.format('MM-DD HH:mm');
      }
      else if (datetime.dayOfYear() - now.dayOfYear() == 2) {
        return datetime.format('前天 HH:mm');
      }
      else if (datetime.dayOfYear() - now.dayOfYear() == 1) {
        return datetime.format('昨天 HH:mm');
      }
      else if (datetime.dayOfYear() - now.dayOfYear() == 0) {
        return datetime.format('HH:mm');
      }
      return datetime.format('MM-DD HH:mm');
    }
  })
  .service("format_datetime_mmdd", function () {
    return function (str) {
      /**
       * 格式化列表时间
       */
      if (!str || str == "") {
        return "";
      }
      var datetime = moment(str);
      return datetime.format('MM-DD');
    }
  })
  .service("openUrl", function ($injector) {
    var Store = $injector.get('Store');
    return function (url) {
      if (!url)
        return;
      Store.get("ttjd_sessionid").then(function (sessionid) {
        if (url.indexOf('?') == -1) {
          url = url + "?sessionid=" + sessionid;
        }
        else {
          url = url + "&sessionid=" + sessionid;
        }
        cordova.InAppBrowser.open(url, "__blank", 'location=false');
      });

    }
  })
  .service("inputTextBox", function ($q, $ionicPopup) {

    return function ($scope, title, placeholder, default_text) {
      var defered = $q.defer();
      $scope = $scope.$new();
      $scope.text = default_text || "";
      $scope.placeholder = placeholder || "";
      $scope.ok = function () {
        $scope.popup.close();
        defered.resolve($scope.text);
      };
      $scope.popup = $ionicPopup.show({
        template: '<input type="text" placeholder="{{placeholder}}" ng-model="$parent.text" key-enter="ok()">',
        title: title,
        scope: $scope,
        buttons: [
          {
            text: '取消',
            type: 'button-stable',
            onTap: function (e) {
              defered.reject();
            }
          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              defered.resolve($scope.text);
            }
          }
        ]
      });
      return defered.promise;
    }
  })
  .service("inputNumberBox", function ($q, $ionicPopup) {

    return function ($scope, title, placeholder, default_text) {
      var defered = $q.defer();
      $scope = $scope.$new();
      $scope.text = default_text || "";
      $scope.placeholder = placeholder || "";
      $ionicPopup.show({
        template: '<input type="number" placeholder="{{placeholder}}" ng-model="$parent.text">',
        title: title,
        scope: $scope,
        buttons: [
          {
            text: '取消',
            type: 'button-stable',
            onTap: function (e) {
              defered.reject();
            }
          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              defered.resolve($scope.text);
            }
          }
        ]
      });
      return defered.promise;
    }
  })
  .factory('safeApply', function ($rootScope) {
    return function ($scope, fn) {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } else {
        if (fn) {
          $scope.$apply(fn);
        } else {
          $scope.$apply();
        }
      }
    }
  })
  .service("parseURL", function () {
    return function (url) {
      var a = document.createElement('a');
      a.href = url;
      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
          var ret = {},
            seg = a.search.replace(/^\?/, '').split('&'),
            len = seg.length, i = 0, s;
          for (; i < len; i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
          return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
      };
    }
  })
  .service("share", function ($q, httpReq, $injector) {
    var SelectUser = $injector.get('SelectUser');
    return function ($scope, project_id, file_group_flag, object_id) {
      var defered = $q.defer();
      var to_users = [];
      SelectUser.getUsers($scope, project_id).then(function (data) {
        _(data).each(function (p) {
          to_users.push(p.id);
        });
        to_users = to_users.join(',');
        httpReq("/ns/user/share", {
          project_id: project_id,
          to_users: to_users,
          flag: file_group_flag,
          object_id: object_id
        }).then(function (data) {
          defered.resolve();
        });
      });
      return defered.promise;
    }
  })
  .service("OpenAppByTypeflag", function ($q, $state, httpReq, showToast) {
    /**
     * 根据typeflag跳转应用
     * by: 魏璐 at:2016-03-08
     * @param typeflag
     * @param objid
     */
    return function (typeflag, objid) {
      if (typeflag == 'shenpi') {
        httpReq("/ns/project/get_app_object_point", {typeflag: typeflag, object_id: objid}).then(function (data) {
          $state.go("app-shenpi-info", {projectid: data.result.project, appid: data.result.id, spid: objid});
        });
      }
      else if (typeflag == 'task') {
        httpReq("/ns/project/get_app_object_point", {typeflag: typeflag, object_id: objid}).then(function (data) {
          $state.go("app-task-info", {projectid: data.result.project, appid: data.result.id, objid: objid});
        });
      }
      else if (typeflag == 'work_report') {
        httpReq("/ns/project/get_app_object_point", {typeflag: typeflag, object_id: objid}).then(function (data) {
          $state.go("app-workreport-info", {projectid: data.result.project, appid: data.result.id, wrid: objid});
        });
      }
      else if (typeflag == 'project_notice') {
        httpReq("/ns/project/get_app_object_point", {typeflag: typeflag, object_id: objid}).then(function (data) {
          $state.go("app-project-notice-info", {projectid: data.result.project, appid: data.result.id, objid: objid});
        });
      }
      else if (typeflag == 'log') {
        httpReq("/ns/project/get_app_object_point", {typeflag: typeflag, object_id: objid}).then(function (data) {
          httpReq("/ns/project/query_sg_tq_by_sglog_id", {id: objid}).then(function (riqi) {
            $state.go("app-shigongrizhi-info", {
              projectid: data.result.project,
              appid: data.result.id,
              objid: objid,
              rizhi_id: riqi.result.sg_tq_log_id,
              message_page: true
            });
          })
        });
      }
      else {
        showToast("暂不支持此信息");

      }
    }
  })
  //.service("getContacts", function ($q, $injector) {
  //  var dbContacts = $injector.get("dbContacts");
  //  return function () {
  //    var deferred = $q.defer();
  //    dbContacts.exists().then(function (exists) {
  //      alert("exists 0")
  //      if (exists) {
  //        alert("exists 1")
  //        dbContacts.all().then(function (list) {
  //          alert(JSON.stringify(list));
  //          deferred.resolve(list);
  //        });
  //      }
  //      var options = new ContactFindOptions();
  //      options.multiple = true;
  //      var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
  //      navigator.contacts.find(fields, function (data) {
  //        alert("xxx 0")
  //        var list = [];
  //        _(data).each(function (user) {
  //          var name = user.displayName || user.name.formatted;
  //          //var url = window.ttjd_config.base_url + '/ns/user/get_user_icon_by_name?name=' + name;
  //          //_(user.phoneNumbers).each(function (tel) {
  //          //  var tel = tel.value.replace(" ", '').replace(/\-/g, '').replace("+86", '');
  //          //  list.push({name: name, tel: tel, select: false, select_duan_xin: false, url: url});
  //          //});
  //          _(user.phoneNumbers).each(function (tel) {
  //            var tel = tel.value.replace(" ", '').replace(/\-/g, '').replace("+86", '');
  //            dbContacts.add(name, tel);
  //          });
  //        });
  //        alert("xxx 2")
  //        dbContacts.save().then(function () {
  //          dbContacts.all().then(function (list) {
  //            alert("xx");
  //            deferred.resolve(list);
  //          });
  //        }, function () {
  //          alert("save error");
  //        });
  //      }, function () {
  //        deferred.reject();
  //      }, options);
  //    })
  //    return deferred.promise;
  //  }
  //})
  .service("getContacts", function ($q, $injector) {
    var KeyValueStore = $injector.get("KeyValueStore");
    return function () {
      var deferred = $q.defer();
      if (KeyValueStore.get("getContacts_cache").then(function (data) {
          if (data) {
            deferred.resolve(JSON.parse(data));
          }
        }))
        var options = new ContactFindOptions();
      options.multiple = true;
      var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
      navigator.contacts.find(fields, function (data) {
        var list = [];
        _(data).each(function (user) {
          var name = user.displayName || user.name.formatted;
          var url = window.ttjd_config.base_url + '/ns/user/get_user_icon_by_name?name=' + name;
          if (user.phoneNumbers) {
            _(user.phoneNumbers).each(function (tel) {
              var tel = tel.value.replace(/ /g, '').replace(/\-/g, '').replace("+86", '');
              list.push({name: name, tel: tel, select: false, select_duan_xin: false, url: url});
            });
          }
        });
        //list.sort(function (a, b) {
        //  var a_name= a.name || '';
        //  var b_name= b.name || '';
        //  return a_name.localeCompare(b_name);
        //});
        //list = _(list).sortBy("name");
        KeyValueStore.set("getContacts_cache", JSON.stringify(list));
        deferred.resolve(list);
      }, function () {
        deferred.reject();
      }, options);
      return deferred.promise;
    }
  })
  .factory('localStorage', function () {
    var localStorage = window.localStorage;
    return {
      get: function (key) {
        return localStorage.getItem(key) || "";
      },
      set: function (key, value) {
        return localStorage.setItem(key, value);
      },
      remove: function (key) {
        localStorage.removeItem(key);
      }
    }
  });


