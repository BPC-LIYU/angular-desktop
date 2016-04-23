/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
    '$rootScope', '$timeout', '$q', function ($rootScope, $timeout, $q) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled, loading;
                loading = false;
                scrollDistance = 1;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {
                    // console.log('run handler ----');
                    var elementBottom, remaining, shouldScroll, windowBottom, result;
                    if (loading)
                        return;
                    windowBottom = elem[0].scrollHeight - elem.scrollTop();
                    elementBottom = elem.height();
                    remaining = windowBottom - elem.height();
                    // console.log('scrollHeight', elem[0].scrollHeight);
                    // console.log('elementBottom', elementBottom);
                    // console.log('windowBottom', windowBottom);
                    // console.log('remaining', remaining);
                    shouldScroll = remaining <= scrollDistance * 100;
                    if (shouldScroll && scrollEnabled) {
                        loading = true;
                        if ($rootScope.$$phase) {
                            result = scope.$eval(attrs.infiniteScroll);
                            $q.when(result, function () {
                                loading = false;
                                $timeout(function () {
                                    handler();
                                })

                            }, function () {
                                loading = false;
                            });
                            return result;
                        } else {
                            result = scope.$apply(attrs.infiniteScroll);
                            $q.when(result, function () {
                                loading = false;
                                $timeout(function () {
                                    handler();
                                })
                            }, function () {
                                loading = false;
                            });
                            return result;
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                elem.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return elem.off('scroll', handler);
                });
                return $timeout((function () {
                    return handler();
                }), 0);
            }
        };
    }
]);
