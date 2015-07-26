/**
 * Created by jie on 15/7/2.
 */
angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http,$rootScope,$ionicLoading,$ionicPopup) {
        //
        $ionicLoading.show({content: '初始化'});

        $http.get('http://huyugui.f3322.org:3000/category') .success(function (data) {

                $rootScope.category=data;

        }).error(function (reason) {
            //
            $ionicPopup.alert({
                title: '错误',
                template: '服务器错误:'+reason
            });
            //
        }).finally(function(){
            $ionicLoading.hide();
        });
        //

    })
    .controller('BrowseDetailCtrl', function ($scope,$state,$http,$rootScope,$stateParams,$ionicLoading,$ionicModal,$ionicPopup) {
        //
       $scope.question = angular.fromJson($stateParams.params);

        //

    })
    //浏览
    .controller('BrowseCtrl', function ($scope,$state,$http,$rootScope,$ionicLoading,$ionicModal,$ionicPopup) {
        //
        $scope.answer = function($index){
            //
            $ionicLoading.show();
            var v =  $scope.questions[$index];
            delete v.$$hashKey;
            v.doctor=$rootScope.user._id;

            $http.put('http://huyugui.f3322.org:3000/questions',v).success(function (data) {
                $ionicPopup.alert({
                    title: '',
                    template: '认领成功'
                });
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误'
                });
                //
            }).finally(function(){
                $ionicLoading.hide();
            });
            //
        }
        //
        var loadQuestion = function(){
            $scope.questions =[];
            $http.get('http:///huyugui.f3322.org:3000/questions/unanswered',{params:{"tags[]":$rootScope.user.selected,doctor:$rootScope.user._id}}) .success(function (data) {

                if (data != null) {
                    $scope.questions    =data;

                } else {
                    //

                    //
                }
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        $scope.doRefresh = function() {
            loadQuestion();
        };

        //
        $scope.goDetail =function($index){
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.browseDetail',{params:params});
        }

        //

        loadQuestion();
    })
    .controller('LoginCtrl', function ($scope,$http,$state,$rootScope,$ionicPopup,$ionicLoading) {
        $scope.data = {phone:"",password:""};

        $scope.login = function(){
            //
            $ionicLoading.show({content: '正在登录'});
            $http.get('http://huyugui.f3322.org:3000/doctor',{params:$scope.data}) .success(function (data) {
                if (data != null) {
                    //
                    if(data.length >0) {
                        $rootScope.user = data[0];
                        $state.go('app.browse');
                    }
                    else
                    {
                        $ionicPopup.alert({
                            title: '错误',
                            template: '服务器错误'
                        });
                    }
                    //
                }
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:'+reason
                });
                //
            }).finally(function(){
                $ionicLoading.hide();
            });
            //
            //$http.get('"http://iapp.iiyi.com/yjtt/v1/user/login/',{params: $scope.data}).success(function (data) {
            //    if(data.code != "200")
            //    {
            //        $ionicPopup.alert({
            //            title: '错误',
            //            template: data.msg
            //        });
            //    }
            //    else {
            //        $ionicPopup.alert({
            //            title: '',
            //            template: '登录成功'
            //        }).then(function (res) {
            //            $state.go('app.browse');
            //        });
            //        $rootScope.user = data;
            //    }
            //
            //}).error(function (reason) {
            //    //
            //    $ionicPopup.alert({
            //        title: '错误',
            //        template: '服务器错误:' + reason
            //    });
            //    //
            //}).finally(function () {
            //    $ionicLoading.hide();
            //});
        }
        $scope.register=function(){
            $state.go('register')
        }
    })
    .controller('SearchCtrl',function($scope){
        //

        //
    })
    .controller('CommentDetailCtrl',function($scope,$stateParams,$rootScope,$http){
        //
        $scope.question  = angular.fromJson($stateParams.params);
        var loadComments = function () {
            //
            $http.get('http://huyugui.f3322.org:3000/comments/'+$scope.question._id).success(function (data) {
                //
                $scope.comments = data;
                //
            }).error(function (reason) {
                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                //
            });
            //
        }
        loadComments();
        //
        // $scope.comments = question.comments;
        $scope.data ={};
        $scope.sendComment = function(){
            //
            $scope.data.doctor = $rootScope.user;
            $scope.data.time=Date.now();
            $scope.data.question=$scope.question._id;

            var j=3;
            $http.post('http://huyugui.f3322.org:3000/comments',$scope.data).success(function (data) {
                //
                loadComments();
                //
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                //
            });
        }
        //

        //

        //
        $scope.doRefresh = function() {
            loadComments();
        };
        //

        //
    })
    //审核
    .controller('AuditCtrl', function ($scope,$http,$rootScope,$state,$ionicLoading,$ionicPopup) {
        //
        $scope.questions = [];
        //$scope.$on('$stateChangeSuccess', function() {
        //    $scope.loadMore();
        //});
        //
        $scope.goDetail = function($index){
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.commentDetail', { 'params': params });
        }
        //
        var LoadQuestion=function(){
            $http.get('http://huyugui.f3322.org:3000/questions/answered',{params:{"tags[]":$rootScope.user.selected}}).success(function (data) {
                if (data.length>0) {
                    $scope.questions= data;
                }
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        //
        $scope.doRefresh = function() {
            LoadQuestion();
        };
        LoadQuestion();
        //
    })
    //历史
    .controller('HistoryCtrl', function ($scope,$state,$rootScope,$http,$ionicLoading) {
        //
        $scope.questions = [];
        //$scope.$on('$stateChangeSuccess', function() {
        //    $scope.loadMore();
        //});
        //
        $scope.modify = function($index){
            //
            $http.put('http://huyugui.f3322.org:3000/questions',$scope.questions[$index]).success(function (data) {
                //
                //
            }).error(function (reason) {
                //

                //
            }).finally(function(){
            // Stop the ion-refresher from spinning
               //

            });
            //
        }
        $scope.goDetail = function($index){
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.commentDetail', { 'params': params });
        }
        //
        var LoadQuestion=function(){
            $http.get('http://huyugui.f3322.org:3000/questions/doctor',{params:{"tags[]":$rootScope.user.selected,doctor:$rootScope.user._id}}).success(function (data) {
                if (data.length>0) {
                    $scope.questions= data;
                }
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        //
        $scope.doRefresh = function() {
            LoadQuestion();
        };
        LoadQuestion();

    })
    .controller('CategoryCtrl', function ($scope,$rootScope,$state) {
        //
        //$rootScope.user.selected["外科"][0]=false;
        //k=2;
        $scope.selected = new Array();
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.category.forEach(function (e, i, a) {
                $scope.selected[e.name] = new Array();
                $scope.selected[e.name][e.child_depart.length] = 'NO';
                e.child_depart.forEach(function (e1, i1, a1) {

                    $rootScope.user.selected.forEach(function (e2, i2, a2) {
                        if (e1 == e2) {

                            $scope.selected[e.name][i1] = 'YES';
                        }

                    })
                });
            });
        });
        $scope.$on('$ionicView.beforeLeave', function() {
            //
            $rootScope.user.selected =[];
            $rootScope.category.forEach(function (e, i, a) {

                e.child_depart.forEach(function (e1, i1, a1) {

                    if($scope.selected[e.name][i1] == 'YES'){
                        //
                        console.log(e1);
                       $rootScope.user.selected.push(e1);

                        //
                    }

                });
            });


            //
        });
        //
        //
    })
    //首页
    .controller('HomeCtrl', function ($scope) {

    })
    //注册
    //("http://iapp.iiyi.com/zlzs/v7/ext/register/", param);

    .controller('RegisterCtrl', function ($scope,$ionicLoading,$rootScope,$ionicPopup,$http,$state) {
        $scope.data = {username:'',password:'',dept1:'1',phone:'',dept2:'2',checkphonev:'1',os:'1',invitcode:'345'};
        $scope.register = function() {
            $ionicLoading.show({content: '正在注册'});
            $http.get('http://iapp.iiyi.com/zlzs/v7/ext/register/',{params: $scope.data}).success(function (data) {
              if(data.code != "200")
              {
                  $ionicPopup.alert({
                      title: '错误',
                      template: data.msg
                  });
              }
              else {
                  $ionicPopup.alert({
                      title: '',
                      template: '注册成功'
                  }).then(function (res) {
                      $state.go('app.browse');
                  });
                  $rootScope.user = data;
              }

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:' + reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
    })
    .controller('PersonalCtrl', function ($scope) {
        $scope.person = {name:'王二',age:'33',dep:'内科',sex:'男'};

    })
    .controller('ForgetpasswordCtrl', function ($scope,$http,$ionicPopup,$state,$ionicLoading) {
        $scope.data={vcode:'',phone:'',username:'',password:''};
        //
        $scope.next = function(){
            //
            $ionicLoading.show({content: '获取验证码'});
            $http.get("http://iapp.iiyi.com/zlzs/v7/user/sendcode/", {params:{phone:$scope.data.phone,os:1}}).success(function (data) {
                if(data.code != "200")
                {
                    $ionicPopup.alert({
                        title: '错误',
                        template: data.msg
                    });
                }
                else {
                    $state.go('forget2');
                }

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:' + reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
            //
        }
        //
        $scope.reset = function(){
            //
            $ionicLoading.show({content: '获取验证码'});
            $http.get("http://iapp.iiyi.com/zlzs/v5/user/reset/", {params:{username:$scope.data.username,
                password:$scope.data.password,vcode:$scope.data.vcode,os:"1"}}).success(function (data) {
                if(data.code != "200")
                {
                    $ionicPopup.alert({
                        title: '错误',
                        template: data.msg
                    });
                }
                else {
                    $state.go('app.browse');
                }

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:' + reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
            //
        }

    });