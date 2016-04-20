/**
 * Created by fanjunwei on 16/1/19.
 */
var directive_app = angular.module('directive', [])
  .directive('contenteditable', function () {
    return {
      restrict: 'A',
      require: '?ngModel', // get a hold of NgModelController
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) {
          return
        }
        var opts = {};
        angular.forEach([
          'sl'
        ], function (opt) {
          var o = attrs[opt];
          opts[opt] = o !== undefined && o !== 'false'
        });

        element.bind('keydown', function (e) {
          var key = e.which || e.keyCode || 0;
          if (key == 13 && opts.sl) {
            return false;
          }
        });
        element.click(function () {
          if (window.getSelection) {//ie11 10 9 ff safari
            element.focus(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection();//创建range
            range.selectAllChildren(element[0]);//range 选择obj下所有子内容
            range.collapseToEnd();//光标移至最后
          }
          else if (document.selection) {//ie10 9 8 7 6 5
            var range = document.selection.createRange();//创建选择对象
            //var range = document.body.createTextRange();
            range.moveToElementText(element[0]);//range定位到obj
            range.collapse(false);//光标移至最后
            range.select();
          }
        });
        function value_to_html(value) {
          if (value) {
            value = value.split("\n");
            var html = "";
            var is_first_line = true;
            value.forEach(function (item) {
              if (is_first_line) {
                is_first_line = false;
                html += item;
              }
              else {
                html += "<div>" + item + "</div>";
              }
            })
            return html;
          }
          else {
            return "";
          }
        }

        if (!ngModel) return; // do nothing if no ng-model
        // Specify how UI should be updated
        ngModel.$render = function () {

          element.html(value_to_html(ngModel.$viewValue));
        };
        element.html(value_to_html(ngModel.$viewValue));
        // Listen for change events to enable binding
        element.on('blur change input', function () {
          read();
        });
        // Write data to the model
        function read() {
          var html = element.html();

          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html == '<br>') {
            html = '';
          }
          var value = html.replace(/<div>/g, "\n").replace(/<\/div>/g, "").replace(/<br>/g, "");
          var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
          value = value.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
          });
          //console.log(value);
          ngModel.$setViewValue(value);
        }
      }
    };
  })
  .directive('select', function () {
    return {
      restrict: 'E', // only activate on element attribute
      link: function (scope, element, attrs, ngModel) {
        ionic.on('native.keyboardshow', onShow, window);
        ionic.on('native.keyboardhide', onHide, window);
        //deprecated
        ionic.on('native.showkeyboard', onShow, window);
        ionic.on('native.hidekeyboard', onHide, window);
        element.bind('click', function () {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        });
        function onShow(e) {

        }

        function onHide() {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        scope.$on('$destroy', function () {
          ionic.off('native.keyboardshow', onShow, window);
          ionic.off('native.keyboardhide', onHide, window);

          //deprecated
          ionic.off('native.showkeyboard', onShow, window);
          ionic.off('native.hidekeyboard', onHide, window);
        });
      }
    };
  })
  .directive('qrcode', function () {
    return {
      restrict: 'E', // only activate on element attribute
      template: '<div></div>',
      replace: true,
      link: function (scope, element, attrs, ngModel) {
        function show() {
          if (attrs.data) {
            var canvas = $(qrgen.canvas({
              data: attrs.data
            }));
            canvas.attr("style", attrs.qrcodeStyle);
            canvas.attr("class", attrs.qrcodeClass);
            element.html(canvas);
          }
          else {
            element.empty();
          }
        }

        attrs.$observe("data", function () {
          show();
        });
        show();
      }
    };
  })
  .directive('keyEnter', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        element.bind('keydown', function (e) {
          var key = e.which || e.keyCode || 0;
          if (key == 13) {
            scope.$eval(attrs.keyEnter);
            return false;
          }
        });
      }
    };
  })
