/**
 * Created by jie on 15/7/2.
 */
var registerData = {name: '', password: '', phone: '', vcode: '', selected: [], image: 'default.jpg', age: '23'};
angular.module('starter.controllers', ['ionic.utils', 'ngCordova'])

    .controller('AppCtrl', function ($scope, $http, $rootScope, $ionicLoading, $ionicPopup, SERVER) {
        //

        $ionicLoading.show({content: '初始化'});

        $http.get(SERVER.url + '/category').success(function (data) {

            $rootScope.category = data;

        }).error(function (reason) {
            //
            $ionicPopup.alert({
                title: '错误',
                template: reason
            });
            //
        }).finally(function () {
            $ionicLoading.hide();
        });
        //

    })
    //浏览
    .controller('BrowseCtrl', function ($scope, $state, $http, $rootScope, $ionicLoading, $ionicModal, $ionicPopup, SERVER) {
        //

        $scope.image_url = SERVER.url + "/images/" + $rootScope.user.image;
        $scope.isActive = [];
        $scope.answer = function ($index) {
            //
            $ionicLoading.show();

            var v = $scope.questions[$index];


            delete v.$$hashKey;
            if (v.doctor == null) {
                v.doctor = $rootScope.user._id;
                v.answerTime=Date.now();
                $http.put(SERVER.url + '/questions', v).success(function (data) {


                }).error(function (reason) {
                    //
                    $ionicPopup.alert({
                        title: '错误',
                        template: reason
                    });
                    //
                }).finally(function () {
                    $ionicLoading.hide();
                });
            } else {
                v.doctor = null;
                v.answerTime = null;
                $http.put(SERVER.url + '/questions', v).success(function (data) {


                }).error(function (reason) {
                    //
                    $ionicPopup.alert({
                        title: '错误',
                        template: reason
                    });
                    //
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }

            //
        }
        //
        var loadQuestion = function () {
            $scope.questions = [];
            $http.get(SERVER.url + '/questions/unanswered', {
                params: {
                    "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id
                }
            }).success(function (data) {


                $scope.questions = data;

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        $scope.doRefresh = function () {
            loadQuestion();
        };

        //
        $scope.goDetail = function ($index) {
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.browseDetail', {params: params});
        }
        //
        loadQuestion();
    })
    .controller('LoginCtrl', function ($scope, $http, $state, $rootScope, $ionicPopup, $localstorage, $ionicLoading, SERVER) {
        $scope.data = {phone: "", password: ""};

        $scope.$on('$ionicView.beforeEnter', function () {
            var user = $localstorage.getObject('user');
            console.log(JSON.stringify(user));
            if (user != null) {
                $rootScope.user = user;
                $state.go('app.browse', {}, {reload: true});
            }
        });
        $scope.login = function () {
            //
            $ionicLoading.show({content: '正在登录'});
            $http.get(SERVER.url + '/doctor/login', {params: $scope.data}).success(function (data) {
                if (data != null) {
                    //
                    $localstorage.setObject('user', data[0]);
                    $rootScope.user = data[0];
                    $state.go('app.browse');

                }
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });

        }
        $scope.register = function () {
            $state.go('register')
        }
    })
    .controller('SearchCtrl', function ($scope) {
        //

        //
    })
    .controller('CommentDetailCtrl', function ($scope, $stateParams, $rootScope, $http, $ionicLoading, SERVER) {
        //
        $scope.question = angular.fromJson($stateParams.params);
        var loadComments = function () {
            //
            $http.get(SERVER.url + '/comments/question', {params: {question: $scope.question._id}}).success(function (data) {
                //
                $scope.comments = data;
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
            }).finally(function () {
                // Stop the ion-refresher from spinning
                //
                $scope.$broadcast('scroll.refreshComplete');
            });
            //
        }
        loadComments();
        //
        // $scope.comments = question.comments;
        $scope.data = {};
        $scope.sendComment = function () {
            //
            $scope.data.doctor = $rootScope.user;
            $scope.data.time = Date.now();
            $scope.data.question = $scope.question._id;
            $ionicLoading.show({content: '正在发送'});
            var j = 3;
            $http.post(SERVER.url + '/comments', $scope.data).success(function (data) {
                //
                loadComments();
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:' + reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                //
                $ionicLoading.hide();
            });
        }

        $scope.doRefresh = function () {
            loadComments();
        };
    })
    //
    .controller('MyCollectionCtrl', function ($state, $http, $rootScope, $ionicLoading, $ionicPopup, $scope, SERVER) {

        $scope.goDetail = function ($index) {
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.commentDetail', {'params': params});
        }
        var download = function () {

            $http.get(SERVER.url + '/questions/ids', {params: {'ids[]': $rootScope.user.collections}}).success(function (data) {
                //
                $scope.questions = data;
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: '服务器错误:' + reason
                });
                //
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        download();
        $scope.doRefresh = function () {
            download();
        };
        //
    })
    //审核
    .controller('AuditCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading, $cordovaDevice, NewMedia, $cordovaFile, $ionicPopup, SERVER, $cordovaCapture) {
        //
        $scope.questions = [];
        var access_token = '';
        $http.get(SERVER.url + '/getkey').success(function (data) {
            access_token = data.access_token;

        }).error(function (reason) {
            //
            //
        }).finally(function () {
            // Stop the ion-refresher from spinning
        });

        var mediaSrc = cordova.file.externalRootDirectory + "mytest.amr";

        console.log(mediaSrc);
        var mediaSource = new NewMedia(mediaSrc, function () {
            console.log('succeed capture');
        }, function () {
            console.log('error capture');
        }, function () {
            console.log('status');
        });
        //

        $scope.stopCaptureAudio = function () {
            console.log('stop capture');
            $ionicLoading.hide();
            mediaSource.stopRecord();
            //
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "mytest.amr", function (fileEntry) {

                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        var temp = this.result.substring(this.result.indexOf(',') + 1);
                        var uuid = $cordovaDevice.getUUID();
                        var data = {
                            format: 'amr',
                            rate: 8000,
                            channel: 1,
                            cuid: uuid,
                            token: access_token,
                            speech: temp,
                            len: file.size
                        };
                        $ionicLoading.show();
                        //console.log(JSON.stringify(data));
                        $http.post("http://vop.baidu.com/server_api", data).success(function (data) {
                            //
                            // this callback will be called asynchronously
                            // when the response is available
                            if(data.err_no==0) {
                                $scope.data.search_string = data.result;
                                $scope.search();
                            }
                            else
                                $ionicPopup.alert({
                                    title: '错误',
                                    template: '语音识别错误,错误原因为:'+data.err_msg
                                });
                        }).error(function (reason) {
                            $ionicPopup.alert({
                                title: '错误',
                                template: '服务器错误'
                            });
                        }).finally(function(){
                            $ionicLoading.hide();
                        });
                    }
                    reader.readAsDataURL(file);
                });

            }, function (e) {
                console.log("FileSystem Error");
            });
        };
        $scope.beginCaptureAudio = function () {
            // Record audio
           // $ionicLoading.show({ scope:$scope, template: ''<i class="ion-loading-c"></i><button class="button button-clear icon-left ion-close-circled" style="line-height: normal; min-height: 0; min-width: 0;" ng-click="cancelSearch()" ></button>'+toastStr});
            $ionicLoading.show({
                scope:$scope,
                // The text to display in the loading indicator
                template: '<i class="ion-loading-c"></i> <br><h1>请说出你要搜索的内容</h1><br><button ng-click="stopCaptureAudio()" class="button button-block">确定</button>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 100,
                showDelay: 0
            });
            mediaSource.startRecord();

        };
        var addLikeNumberLog = [];

        $scope.addLikeNumber = function (question) {
            if (addLikeNumberLog.indexOf(question._id) != -1)
                return;
            $ionicLoading.show();

            question.likeNumber += 1;
            $http.put(SERVER.url + '/questions', question).success(function (data) {
                addLikeNumberLog.push(question._id);
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $ionicLoading.hide();
            });
        }
        $scope.goDetail = function ($index) {
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.commentDetail', {'params': params});
        }
        $scope.data = {search_string: ""};
        //


        $scope.search = function () {
            //

            $ionicLoading.show({content: '正在查找'});
            $http.get(SERVER.url + '/questions/search', {params: {"search": $scope.data.search_string}}).success(function (data) {

                $scope.questions = data;

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $ionicLoading.hide();

            });
            //
        }
        //

        //
        $scope.collection = function (question) {
            //
            $ionicLoading.show({content: '正在修改'});
            if ($rootScope.user.collections.indexOf(question._id) != -1) {
                var index = $rootScope.user.collections.indexOf(question._id);
                $rootScope.user.collections.splice(index, 1)
            } else
                $rootScope.user.collections.push(question._id);
            $http.put(SERVER.url + '/doctors', $rootScope.user).success(function (data) {
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $ionicLoading.hide();
            });
            //
        }
        //
        var LoadQuestion = function () {
            $http.get(SERVER.url + '/questions/answered', {params: {"categorys[]": $rootScope.user.selected}}).success(function (data) {
                if (data.length > 0) {
                    $scope.questions = data;
                }
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        //
        $scope.doRefresh = function () {
            LoadQuestion();
        };
        LoadQuestion();
        //
    })
    //历史
    .controller('HistoryCtrl', function ($scope, $state, $rootScope, $http, $ionicLoading, $ionicPopup, SERVER) {
        //
        $scope.questions = [];


        $scope.modify = function ($index) {
            //
            $ionicLoading.show({content: '正在修改'});
            $scope.questions[$index].answerTime=Date.now();
            $http.put(SERVER.url + '/questions', $scope.questions[$index]).success(function (data) {
                //
                $ionicPopup.alert({
                    title: '',
                    template: '修改成功'
                });
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                //
                $ionicLoading.hide();
            });
            //
        }
        $scope.goDetail = function ($index) {
            var params = angular.toJson($scope.questions[$index]);
            $state.go('app.commentDetail', {'params': params});
        }
        //
        var LoadQuestion = function () {
            $http.get(SERVER.url + '/questions/doctor', {
                params: {
                    "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id
                }
            }).success(function (data) {

                    $scope.questions = data;

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
        //
        $scope.doRefresh = function () {
            LoadQuestion();
        };
       // LoadQuestion();
        //
        $scope.noMoreItemsAvailable=true;

        $scope.loadMore = function() {

            var time=null;
            if($scope.questions.length != 0){
                time = $scope.questions[$scope.questions.length-1].answerTime;
            }
            $http.get(SERVER.url+'/questions/doctor', {params: {
                "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id,
                minAnswerTime: time
            }}).success(function(data) {
                if(data.length ==0) {
                    $scope.noMoreItemsAvailable = false;

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.questions = $scope.questions.concat( data);


                }
            }).error(function(data) {

            }).finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');


            });
        };
        //
        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });

    })
    .controller('CategoryCtrl', function ($scope, $rootScope, $http, $state, SERVER) {
        //
        //$rootScope.user.selected["外科"][0]=false;
        //k=2;
        $scope.selected = new Array();
        $scope.$on('$ionicView.beforeEnter', function () {
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
        $scope.$on('$ionicView.beforeLeave', function () {
            //
            $rootScope.user.selected = [];
            $rootScope.category.forEach(function (e, i, a) {

                e.child_depart.forEach(function (e1, i1, a1) {

                    if ($scope.selected[e.name][i1] == 'YES') {
                        //
                        console.log(e1);
                        $rootScope.user.selected.push(e1);

                        //
                    }

                });
            });
            $http.put(SERVER.url + '/doctors', $rootScope.user).success(function (data) {
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning

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

    .controller('RegisterCtrl', function ($scope, $ionicLoading, $rootScope, $ionicPopup, $http, $state, SERVER) {
        $scope.data = registerData;
        $scope.getVcode = function () {
            //
            $ionicLoading.show({content: '正在发送验证码'});
            $http.post(SERVER.url + '/vcode/register', $scope.data).success(function (data) {
                //
                $state.go("register2")
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
            ;
            //
        }
        $scope.register = function () {

            $ionicLoading.show({content: '正在注册'});
            $http.get(SERVER.url + '/vcode/register', {params: $scope.data}).success(function (data) {
                $ionicPopup.alert({
                    title: '',
                    template: '注册成功'
                }).then(function (res) {
                    $state.go('app.browse');
                });
                $rootScope.user = data;

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
    })
    .controller('change-password-ctrl', function ($scope, $rootScope, $state, $http, $ionicPopup, $ionicLoading, SERVER) {
        $scope.data = {oldPassword: '', newPassword: ''};
        $scope.changePassword = function () {
            //
            $ionicLoading.show({});
            $http.post(SERVER.url + '/doctor/changePassword', {
                _id: $rootScope.user._id,
                data: $scope.data
            }).success(function (data) {
                //
                $ionicPopup.alert({
                    title: '',
                    template: '更改成功'
                });
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $ionicLoading.hide();
            });
            //
        }
    })
    .controller('PersonalCtrl', function ($scope, $rootScope, $state, $http, $ionicHistory, $localstorage, SERVER, $cordovaFile, $cordovaFileTransfer) {
        //
        var loadImage = function () {
            var targetPath = cordova.file.dataDirectory + $rootScope.user.image;
            console.log("file path  " + cordova.file.dataDirectory + " " + $rootScope.user.image);
            $cordovaFile.checkFile(cordova.file.dataDirectory, $rootScope.user.image).then(function (success) {
                console.log(" exist file " + targetPath);
                $scope.image_url = targetPath;
            }, function (error) {//不存在文件情况下
                console.log("not exist file " + targetPath);
                $cordovaFileTransfer.download(SERVER.url + "/images/" + $rootScope.user.image, targetPath, {}, true)
                    .then(function (result) {
                        console.log("donwload file succeed");
                        $scope.image_url = targetPath;
                    }, function (reason) {
                        $ionicPopup.alert({
                            title: '错误',
                            template: reason
                        });
                        // Error
                    }, function (progress) {

                    });
            });
        }
        loadImage();
        $scope.logout = function () {
            //
            $rootScope.user = null;
            $localstorage.setObject('user', null);

            $state.go('login')
            //
        }
        $scope.changePassword = function ($scope, $http) {
            //

            $state.go('app.change-password');


            //
        }
        $scope.changeImage = function () {
            //
            navigator.camera.getPicture(function (imageData) {
                console.log(imageData);

                var fileURI = imageData;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = $rootScope.user.name + "_" + Date.now() + '.jpg';
                options.mimeType = "image/jpeg";

                console.log($rootScope.user.image);
                var ft = new FileTransfer();
                ft.upload(fileURI, encodeURI(SERVER.url + "/portrait"), function (result) {
                    //

                    $rootScope.user.image = options.fileName;
                    $scope.update();
                    loadImage();
                    //
                }, function (error) {
                    console.log("image upload failed");
                }, options);
            }, function (message) {
                console.log('Failed because: ' + message);
            }, {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG
            });
            //
        }
        $scope.update = function () {
            //

            $http.put(SERVER.url + '/doctors', $rootScope.user).success(function (data) {

            }).error(function (reason) {
                //
                //
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });
        }
    })
    .controller('ForgetpasswordCtrl', function ($scope, $http, $ionicPopup, $rootScope, $state, $ionicLoading, SERVER) {

        //
        $scope.data = forgetData;
        $scope.next = function () {
            //
            $ionicLoading.show({content: '正在发送验证码'});
            $http.get(SERVER.url + '/vcode/forget', {params: $scope.data}).success(function (data) {
                //
                $state.go("forget2");
                //
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
            //
        }
        $scope.reset = function () {

            $ionicLoading.show({content: '正在重设'});
            $http.post(SERVER.url + '/vcode/forget', $scope.data).success(function (data) {
                $ionicPopup.alert({
                    title: '',
                    template: '重设成功'
                }).then(function (res) {
                    $state.go('app.browse');
                });
                $rootScope.user = data;
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

    });
var forgetData = {vcode: '', phone: '', password: ''};