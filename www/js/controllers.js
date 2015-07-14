/**
 * Created by jie on 15/7/2.
 */
angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http,$rootScope,$ionicModal, $timeout, currencyFilter, $filter) {

        //表单数据的登录模式
        $rootScope.categorys=[{

            "name" : "内科",
            "child_depart" : ["心血管内科", "神经内科", "普通内科", "消化内科", "呼吸内科", "内分泌科", "肾病内科", "血液内科", "感染内科", "老年病内科", "风湿免疫内科", "透析科", "变态反应科", "糖尿病", "甲亢科", "面瘫科", "癫痫科"]
        },{

            "name" : "外科",
            "child_depart" : ["腺体外科", "心脏外科", "器官移植", "微创外科", "功能神经外科", "普通外科", "泌尿外科", "神经外科", "胸外科", "整形外科", "肛肠外科", "肝胆外科", "乳腺外科", "心血管外科"]
        }];
        $rootScope.selected = new Array();
        $rootScope.userSetting={name:'tom',age:14,sex:'男',selected:["心血管内科","神经内科"]};
        $rootScope.categorys.forEach(function(e,i,a){
            $rootScope.selected[e.name]= new Array();
            $rootScope.selected[e.name][e.child_depart.length]='NO';
            e.child_depart.forEach(function(e1,i1,a1){
                var index=0;
                $rootScope.userSetting.selected.forEach(function(e2,i2,a2){
                    if(e1 == e2){
                        $rootScope.selected[e.name][index]='YES';
                    }
                    index++;
                })
            });
        });
        //

        //

    })
    //浏览
    .controller('BrowseCtrl', function ($scope,$state,$http,$rootScope,$ionicModal) {
        //
        $scope.$on('$ionicView.beforeEnter', function() {
            console.log("beforeEnter");
            $http.get('http://127.0.0.1:3000/questions',{params:{tag: $rootScope.userSetting.selected }}) .success(function (data) {

                if (data != null) {
                    $scope.kemu=data;
                } else {

                }

            }).error(function (reason) {

            });
        });
        //
        $scope.filter=function(){

            $state.go('category');
        }
        //

    })
    .controller('LoginCtrl', function ($scope,$state) {
        $scope.login = function(){
            $state.go('app.browse');
        }
        $scope.register=function(){
            $state.go('register')
        }
    })
    .controller('SearchCtrl',function($scope){
        //

        //
    })
    //审核
    .controller('AuditCtrl', function ($scope) {
        //

        //
    })
    //历史
    .controller('HistoryCtrl', function ($scope) {
        //

        //
    })
    .controller('CategoryCtrl', function ($scope,$state) {
        //



        $scope.back=function(){
            //console.log( JSON.stringify($scope.userSetting.selected));
            $ionicHistory.goToHistoryRoot();
        }
        //
    })
    //首页
    .controller('HomeCtrl', function ($scope) {

    })
    //注册
    .controller('RegisterCtrl', function ($scope) {

    })
    .controller('PersonalCtrl', function ($scope) {
        $scope.person = {name:'王二',age:'33',dep:'内科',sex:'男'};

    })