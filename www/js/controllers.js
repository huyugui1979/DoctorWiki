/**
 * Created by jie on 15/7/2.
 */
angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http,$rootScope,$ionicLoading,$ionicPopup) {
        //
        $ionicLoading.show({content: '初始化'});
        $http.get('http://127.0.0.1:3000/category') .success(function (data) {

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
    //浏览
    .controller('BrowseCtrl', function ($scope,$state,$http,$rootScope,$ionicLoading,$ionicModal,$ionicPopup,$rootScope) {
        //
        $scope.doRefresh = function() {
            $scope.questions =[];
            $http.get('http://127.0.0.1:3000/questions',{params:{"tag[]":$rootScope.user.selected,doctor:$rootScope.user._id}}) .success(function (data) {

                if (data != null) {
                    $scope.questions=data;
                    $scope.answers = new Array(data.length);
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
        };
        $scope.$on('$ionicView.afterEnter', function() {
            $rootScope.user.selected.forEach(function (e,i,r){
              console.log(e);
            });
            $http.get('http://127.0.0.1:3000/questions',{params:{"tag[]":$rootScope.user.selected,doctor:$rootScope.user._id}}) .success(function (data) {

                if (data != null) {
                    $scope.questions=data;
                    $scope.answers = new Array(data.length);
                } else {

                }
            }).error(function (reason) {

            });
        });
        //

        //
        $scope.reject = function($index){
            //
            $ionicLoading.show();
            var answer = {doctor:$rootScope.user._id,
                question: $scope.questions[$index]._id,status:"拒答"};
                $http.post('http://127.0.0.1:3000/answer',answer) .success(function (data) {

                    $scope.questions.splice($index,1);
                    $scope.answers.splice($index,1);
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

        $scope.answer = function($index){
            //
            $ionicLoading.show();
            var answer = {doctor:$rootScope.user._id,
                question: $scope.questions[$index]._id,status:"审核中",answer:$scope.answers[$index]};
            $http.post('http://127.0.0.1:3000/answer',answer) .success(function (data) {

                $scope.questions.splice($index,1);
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

    })
    .controller('LoginCtrl', function ($scope,$http,$state,$rootScope,$ionicPopup,$ionicLoading) {
        $scope.data = {phone:"",password:""};
        $scope.login = function(){
            //
            $ionicLoading.show({content: '正在登录'});
            $http.get('http://127.0.0.1:3000/doctor',{params:$scope.data}) .success(function (data) {
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
    .controller('AuditCtrl', function ($scope,$http,$rootScope,$ionicLoading,$ionicPopup) {
        //
        $scope.answers = [];
        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });
        //
        $scope.pass = function($index){
            //
            $ionicLoading.show();
            var audit = {doctor:$rootScope.user._id,
                answer: $scope.answers[$index]._id,status:"通过"};
            $http.post('http://127.0.0.1:3000/audit',audit) .success(function (data) {
                $scope.answers.splice($index,1);
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
        $scope.reject=function($index){
            //
            $ionicLoading.show();
            var audit = {doctor:$rootScope.user._id,
                answer: $scope.answers[$index]._id,status:"不通过"};
            $http.post('http://127.0.0.1:3000/audit',audit) .success(function (data) {
                $scope.answers.splice($index,1);
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
        }
        //
        $scope.loadMore = function() {
            if($scope.answers.length==0)
                $http.get('http://127.0.0.1:3000/audit',{params:{doctor:$rootScope.user._id}}).success(function (data) {
                    if (data.length>0) {
                        $scope.answers = data;
                    }else
                        $scope.moreDataCanBeLoaded=false;
                }).error(function (reason) {
                    //

                    //
                }).finally(function(){
                    // Stop the ion-refresher from spinning
                    //$scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            else
                $http.get('http://127.0.0.1:3000/audit',{params:{doctor:$rootScope.user._id,minDate: $scope.answers.length>0?$scope.answers[$scope.answers.length-1].answerTime:null}}).success(function (data) {
                    if (data.length>0) {
                        $scope.answers=$scope.answers.concat(data);
                    }else
                        $scope.moreDataCanBeLoaded=false;
                }).error(function (reason) {
                    //

                    //
                }).finally(function(){
                    // Stop the ion-refresher from spinning
                    //$scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
        $scope.moreDataCanBeLoaded=true;
        $scope.doRefresh = function() {

            $http.get('http://127.0.0.1:3000/audit',{params:{doctor:$rootScope.user._id,maxDate: $scope.answers.length>0?$scope.answers[0].answerTime:null}}).success(function (data) {
                if (data.length>0) {
                    $scope.answers= data.concat($scope.answers);
                }
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        };
        //
    })
    //历史
    .controller('HistoryCtrl', function ($scope,$rootScope,$http,$ionicLoading) {
        //
        $scope.answers = [];
        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });
        $scope.loadMore = function() {
            if($scope.answers.length==0)
                $http.get('http://127.0.0.1:3000/history',{params:{doctor:$rootScope.user._id}}).success(function (data) {
                    if (data.length>0) {
                        $scope.answers = data;
                    }else
                        $scope.moreDataCanBeLoaded=false;
                }).error(function (reason) {
                    //

                    //
                }).finally(function(){
                    // Stop the ion-refresher from spinning
                    //$scope.$broadcast('scroll.refreshComplete');

                });
            else
            $http.get('http://127.0.0.1:3000/history',{params:{doctor:$rootScope.user._id,minDate: $scope.answers.length>0?$scope.answers[$scope.answers.length-1].answerTime:null}}).success(function (data) {
                if (data.length>0) {
                    $scope.answers=$scope.answers.concat(data);
                }else
                    $scope.moreDataCanBeLoaded=false;
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                //$scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        $scope.moreDataCanBeLoaded=true;
        $scope.doRefresh = function() {

            $http.get('http://127.0.0.1:3000/history',{params:{doctor:$rootScope.user._id,maxDate: $scope.answers.length>0?$scope.answers[0].answerTime:null}}).success(function (data) {
                if (data.length>0) {
                    $scope.answers= data.concat($scope.answers);
                }
            }).error(function (reason) {
                //

                //
            }).finally(function(){
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        };

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
    .controller('RegisterCtrl', function ($scope,$ionicLoading,$ionicPopup,$http) {
        $scope.data = {name:'',password:'',sex:'',phone:''};
        $scope.register = function() {
            $ionicLoading.show({content: '初始化'});
            $http.post('http://127.0.0.1:3000/doctor', $scope.data).success(function (data) {
                $ionicPopup.alert({
                    title: '',
                    template: '注册成功'
                }).then(function(res){
                    $state.go('app.browse');
                });
                $rootScope.user = data;

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