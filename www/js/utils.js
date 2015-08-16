/**
 * Created by yuguihu on 15/8/3.
 */

angular.module('ionic.utils', [])
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                console.log('key '+$window.localStorage[key]);
                return JSON.parse($window.localStorage[key] || null);
            }
        }
    }]);
