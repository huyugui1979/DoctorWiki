/**
 * Created by jie on 15/7/2.
 */
var registerData = {name: '', password: '', phone: '', vcode: '', selected: [], image: 'default.jpg', age: '23'};
angular.module('starter.controllers', ['ionic.utils', 'ngCordova'])

    .controller('AppCtrl', function ($scope, $http, $rootScope, $ionicLoading, $ionicPopup, SERVER) {
        //


        //

    })
    //浏览
    .controller('BrowseCtrl', function ($scope, $state, $http, $rootScope, $timeout, $ionicLoading,QuestionService, $ionicModal, $ionicPopup, SERVER) {
        //
        //if(window.Alert != null)
        //{
        //    window.Alert.alert('ok','ok','ok');
        //    console.log("editor");
        //}
        //$scope.image_url = SERVER.url + "/images/" + $rootScope.user.image;
        $scope.$on('$ionicView.enter', function () {

            loadQuestion();
            // do what you want to do
        })

        $scope.isActive = [];
        $scope.images = [{name: 'a', title: 'b', src: 'img/question.jpg'}, {
            name: 'a',
            title: 'b',
            src: 'img/question.jpg'
        }, {name: 'a', title: 'b', src: 'img/question.jpg'}, {name: 'a', title: 'b', src: 'img/question.jpg'}];
        $scope.answer = function ($index) {
            //
            $ionicLoading.show();

            var v = $scope.questions[$index];


            delete v.$$hashKey;
            if (v.doctor == null) {
                v.doctor = $rootScope.user;
                v.answerTime = Date.now();
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

            $http.get(SERVER.url + '/questions/unanswered', {
                params: {
                    "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id
                }
            }).success(function (data) {

                $scope.questions = data;
                QuestionService.setData(data);

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
            $state.go('app.commentDetail', {params: $index});
        }
        //
    })
    .controller('LoginCtrl', function ($scope, $http, $state, $rootScope, $ionicPopup,$cordovaFile, $cordovaFileTransfer, $localstorage, $ionicLoading, SERVER) {
        $scope.data = {phone: "", password: ""};

        $scope.$on('$ionicView.beforeEnter', function () {
            var user = $localstorage.getObject('user');

            console.log(JSON.stringify(user));
            if (user != null) {
                $ionicLoading.show();
                $http.get(SERVER.url + '/doctors/id', {params: {_id: user._id}}).success(function (data) {
                    console.log("login:"+data);
                    $rootScope.user = data;

                    $state.go('app.browse', {}, {reload: true});
                }).error(function (reason) {
                    $ionicPopup.alert({
                        title: '错误',
                        template: reason
                    });
                }).finally(function(){
                    $ionicLoading.hide();
                });

            }
        });
        //
        var loadImage = function () {
            var targetPath = cordova.file.dataDirectory + $rootScope.user.image;
            $cordovaFileTransfer.download(SERVER.url + "/images/" + $rootScope.user.image, targetPath, {}, true)
                .then(function (result) {
                    console.log("donwload file succeed");
                    console.log(JSON.stringify($rootScope.user));
                    $ionicLoading.hide();

                    $state.go('app.category');
                }, function (reason) {
                    $ionicPopup.alert({
                        title: '错误',
                        template: reason
                    });
                    $ionicLoading.hide();
                }, function (progress) {

                });
        }

        $scope.login = function () {
            //
            $ionicLoading.show({content: '正在登录'});
            $http.get(SERVER.url + '/doctor/login', {params: $scope.data}).success(function (data) {
                if (data != null) {
                    //
                    console.log("login suceeed");
                    $localstorage.setObject('user', data[0]);
                    $rootScope.user = data[0];
                    loadImage();
                }
            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                $ionicLoading.hide();
                //
            }).finally(function () {

            });

        }
        $scope.register = function () {
            $state.go('register')
        }
    })

    .controller('CommentDetailCtrl', function ($scope, $state,QuestionService, $ionicPopover, $stateParams, $timeout, $rootScope, $http, $ionicPopup, $ionicLoading, SERVER) {
        //
        var index = angular.fromJson($stateParams.params);
        $scope.question = QuestionService.getQuestionByIndex(index);
        //
        //var configs = {
        //    readOnly: false,
        //    theme: 'snow'
        //};
        //var quill = new Quill('#editor',configs);
        //quill.addModule('toolbar', { container: '#toolbar' });

        var loadComments = function () {
            //
            $ionicLoading.show({content: ''});
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
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        loadComments();
        //
        $scope.goDetail = function ($index) {
            //window.location.href="editor.html";
            $state.go('app.questionDetail', {params: index});
        }
        $scope.MyModify = function () {
            //
            //if ($rootScope.user._id != $scope.question.doctor._id)
            //    return;
            //$scope.edit = !$scope.edit;
            //if ($scope.edit == false) {
            //    $ionicLoading.show({content: '正在修改'});
            //    $scope.question.answerTime = Date.now();
            //    $http.put(SERVER.url + '/questions', $scope.question).success(function (data) {
            //        //
            //        $ionicPopup.alert({
            //            title: '',
            //            template: '修改成功'
            //        });
            //        //
            //    }).error(function (reason) {
            //        //
            //        $ionicPopup.alert({
            //            title: '错误',
            //            template: reason
            //        });
            //        //
            //    }).finally(function () {
            //        // Stop the ion-refresher from spinning
            //        //
            //        $ionicLoading.hide();
            //    });
            //}

            //
        }
        $scope.collection = function () {
            //
            $ionicLoading.show({content: '正在修改'});
            if ($rootScope.user.collections.indexOf($scope.question._id) != -1) {
                var index = $rootScope.user.collections.indexOf($scope.question._id);
                $rootScope.user.collections.splice(index, 1);
                $scope.question.collectionNumber -= 1;
            } else {
                $rootScope.user.collections.push($scope.question._id);
                $scope.question.collectionNumber += 1;
            }
            $http.put(SERVER.url + '/doctors', $rootScope.user).success(function (data) {

                $http.put(SERVER.url + '/questions', $scope.question).success(function (data) {

                }).error(function (reason) {

                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $ionicLoading.hide();
                });
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
        }
        //
        // $scope.comments = question.comments;
        $scope.data = {};
        $scope.sendComment = function () {
            //
            if($scope.data.content ==null)
            {
                $ionicPopup.alert({
                    title: '错误',
                    template: '请输入评论内容'
                });
                return;
            }
            $scope.data.doctor = $rootScope.user;
            $scope.data.time = Date.now();
            $scope.data.question = $scope.question._id;
            $ionicLoading.show({content: '正在发送'});
            var j = 3;
            $http.post(SERVER.url + '/comments', $scope.data).success(function (data) {
                //
                $scope.question.comments.push(data._id);
                $scope.data.content=null;
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
        //
        $scope.modify = function () {
            $scope.edit = !$scope.edit;
            if ($scope.edit == false) {

            }
        }
        //
        $scope.edit = false;


    })
    //

    //
    .controller('MyCollectionCtrl', function ($state, $http, QuestionService, $rootScope, $timeout, $ionicLoading, $ionicPopup, $scope, SERVER) {

        $scope.goDetail = function ($index) {

            $state.go('app.commentDetail', {'params': $index});
        }
        var download = function () {

            $http.get(SERVER.url + '/questions/ids', {params: {'ids[]': $rootScope.user.collections}}).success(function (data) {
                //
                $scope.questions = data;
                QuestionService.setData(  $scope.questions );

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
        $scope.$on('$ionicView.enter', function () {
            QuestionService.setData($scope.questions);
            // do what you want to do
        })
        //
    })
    //审核

    .controller('AuditCtrl', function ($scope, $http, $rootScope, QuestionService, $state, $timeout, $ionicLoading, $ionicPopup, SERVER,
                                       $cordovaDevice, NewMedia, $cordovaFile, $cordovaCapture) {
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
        //
        var name = null, mediaSrc = null;
        if ($cordovaDevice.getPlatform() == "Android") {
            name = "amr";
            mediaSrc = cordova.file.externalDataDirectory + "test." + name;
        }
        else {
            name = "wav";
            mediaSrc = "test." + name;
            //mediaSrc = mediaSrc.fullPath.indexOf('file://') > -1 ? mediaSrc.fullPath : "file://" + mediaSrc.fullPath;
        }

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
            //var myfile;
            if ($cordovaDevice.getPlatform() != "Android")
                mediaSrc = cordova.file.tempDirectory + mediaSrc;
            console.log(mediaSrc);
            window.resolveLocalFileSystemURL(mediaSrc, function (fileEntry) {

                fileEntry.file(function (file) {

                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        var temp = this.result.substring(this.result.indexOf(',') + 1);
                        var uuid = $cordovaDevice.getUUID();
                        var data = null;

                        data = {
                            format: name,
                            rate: 8000,
                            channel: 1,
                            cuid: uuid,
                            token: access_token,
                            speech: temp,
                            len: file.size
                        }

                        $ionicLoading.show();

                        console.log(JSON.stringify(data));
                        $http.post("http://vop.baidu.com/server_api", data).success(function (data) {
                            //
                            // this callback will be called asynchronously
                            // when the response is available
                            if (data.err_no == 0) {
                                $scope.data.search_string = data.result;
                                $scope.search();
                            }
                            else
                                $ionicPopup.alert({
                                    title: '错误',
                                    template: '语音识别错误,错误原因为:' + data.err_msg
                                });
                        }).error(function (reason) {
                            $ionicPopup.alert({
                                title: '错误',
                                template: '服务器错误' + reason
                            });
                        }).finally(function () {
                            $ionicLoading.hide();
                        });
                    }
                    reader.readAsDataURL(file);
                });

            }, function (e) {
                console.log(JSON.stringify(e));
            });
        };

        $scope.beginCaptureAudio = function () {
            // Record audio
            // $ionicLoading.show({ scope:$scope, template: ''<i class="ion-loading-c"></i><button class="button button-clear icon-left ion-close-circled" style="line-height: normal; min-height: 0; min-width: 0;" ng-click="cancelSearch()" ></button>'+toastStr});
            console.log("begin capture");
            $ionicLoading.show({
                scope: $scope,
                // The text to display in the loading indicator
                template: '<i class="ion-loading-c"></i> <br><h1>请说出你要搜索的内容</h1><br><button ng-click="stopCaptureAudio()" class="button button-block">确定</button>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 100,
                showDelay: 0
            });
            mediaSource.startRecord();
        };

        $scope.goDetail = function ($index) {
            //$ionicViewSwitcher.nextTransition('none');
            $state.go('app.commentDetail', {'params': $index});
        }
        $scope.data = {search_string: ""};
        $scope.cancel = function () {
            console.log("cancel");
            $scope.data.search_string = "";
            LoadQuestion();
        }
        $scope.search = function () {
            //
            $ionicLoading.show({content: '正在查找'});
            $http.get(SERVER.url + '/questions/search', {params: {"search": $scope.data.search_string}}).success(function (data) {
                $scope.questions = data;
                QuestionService.setData( $scope.questions);

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


        var LoadQuestion = function () {

            $http.get(SERVER.url + '/questions/answered', {params: {"categorys[]": $rootScope.user.selected}}).success(function (data) {

                $scope.questions = data;
                //
                QuestionService.setData( $scope.questions);


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
        var LoadingQuestion = function () {
            $ionicLoading.show();
            $http.get(SERVER.url + '/questions/answered', {params: {"categorys[]": $rootScope.user.selected}}).success(function (data) {

                $scope.questions = data;
                //
                QuestionService.setData( $scope.questions);


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
        $scope.doRefresh = function () {
            LoadQuestion();
        };
        LoadingQuestion();
        $scope.$on('$ionicView.enter', function () {
           QuestionService.setData($scope.questions);
            // do what you want to do
        })

    }
)
    .
    controller('HistoryCtrl', function ($scope, $state, $rootScope, $http, $ionicLoading, $timeout, $ionicPopup, QuestionService, SERVER) {
        //加载

        $scope.goDetail = function ($index) {
            $state.go('app.commentDetail', {'params': $index});
        }
        //

        $scope.questions = [];
        //
        $scope.doRefresh = function () {
            $http.get(SERVER.url + '/questions/doctor', {
                params: {
                    "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id
                }
            }).success(function (data) {
                $scope.questions = data;
                QuestionService.setData( $scope.questions);

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: error
                });
                //
            }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            );
        }

        $scope.noMoreItemsAvailable = false;


        $scope.loadMore = function () {

            var minAnswerTime = null;
            if ($scope.questions.length != 0) {
                minAnswerTime = $scope.questions[$scope.questions.length - 1].answerTime;
            }
            $http.get(SERVER.url + '/questions/doctor', {
                params: {
                    "categorys[]": $rootScope.user.selected,
                    doctor: $rootScope.user._id,
                    minAnswerTime: minAnswerTime
                }
            }).success(function (data) {
                if (data.length == 0)
                    $scope.noMoreItemsAvailable = true;
                $scope.questions = $scope.questions.concat(data);
                QuestionService.setData($scope.questions);

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: error
                });
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.$on('$ionicView.enter', function () {
            $scope.doRefresh();
            QuestionService.setData($scope.questions);
            // do what you want to do
        })
    })
    .controller('CategoryCtrl', function ($scope, $rootScope, $http, $state, SERVER) {
        //
        //$rootScope.user.selected["外科"][0]=false;
        //k=2;
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
        $scope.selected = new Array();
        $scope.$on('$ionicView.beforeEnter', function () {
            console.log("cate:"+$rootScope.category);
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


    })
    //首页
    .controller('QuestionDetailCtrl', function ($scope,$stateParams,SERVER,$http,QuestionService) {
        //

        var index = angular.fromJson($stateParams.params);
        $scope.question = QuestionService.getQuestionByIndex(index);
        //
        //var editor = new wysihtml5.Editor("wysihtml5-editor", {
        //    toolbar:     "wysihtml5-editor-toolbar",
        //    parserRules: wysihtml5ParserRules
        //});
        //editor.composer.element.ownerDocument.addEventListener("touchstart", function() {
        //    setTimeout(function() {
        //        editor.composer.iframe.contentWindow.focus();
        //    }, 500); // do not use 0, window will get blur in a short time after touchstart.
        //});
        var editor=null;
        ionic.DomUtil.ready(function() {
             editor = new wysihtml5.Editor('editor', {
                parserRules:  wysihtml5ParserRulesDefaults
            });

            editor.composer.element.ownerDocument.addEventListener("touchstart", function() {
                console.log('hell');
                setTimeout(function() {
                    editor.composer.iframe.focus();
                }, 500); // do not use 0, window will get blur in a short time after touchstart.
            });
            editor.setValue($scope.question.answer);

        });
        $scope.$on('$ionicView.beforeLeave', function () {
           //
            $scope.question.answer = editor.getValue();
            $http.put(SERVER.url + '/questions', $scope.question).success(function (data) {

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: reason
                });
                //
            }).finally(function () {

            });
            //
        });

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
    .controller('PersonalCtrl', function ($scope, $rootScope, $state, $http, $ionicHistory, $ionicLoading, $localstorage, SERVER, $cordovaFile, $cordovaFileTransfer) {
        //
        $rootScope.userImageUrl = cordova.file.dataDirectory + $rootScope.user.image;
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
                $rootScope.userImageUrl = imageData;
                var fileURI = imageData;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = $rootScope.user.name + "_" + Date.now() + '.png';
                options.mimeType = "image/png";

                console.log($rootScope.user.image);
                var ft = new FileTransfer();
                $ionicLoading.show();
                ft.upload(fileURI, encodeURI(SERVER.url + "/portrait"), function (result) {
                    //
                    $rootScope.user.image = options.fileName;
                    $scope.update();
                    $ionicLoading.hide();
                    //
                }, function (error) {
                    console.log("image upload failed");

                }, options);
            }, function (message) {
                console.log('Failed because: ' + message);
                $ionicLoading.hide();
            }, {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                quality: 50,
                targetWidth: 100,
                targetHeight: 100,
                encodingType: Camera.EncodingType.PNG
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


            });
        }
    })
    .controller('MyCommentCtrl',function($scope, $state, $rootScope, $http, $ionicLoading, $timeout, $ionicPopup, QuestionService, SERVER){
        //
        $scope.goDetail = function ($index) {
            $state.go('app.commentDetail', {'params': $index});
        }
        //

        $scope.questions = [];
        //
        $scope.doRefresh = function () {
            $http.get(SERVER.url + '/comments/doctor', {
                params: {
                    doctor: $rootScope.user._id
                }
            }).success(function (data) {
                $scope.questions = data;
                $scope.noMoreItemsAvailable = false;
                QuestionService.setData( $scope.questions);

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: error
                });
                //
            }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            );
        }

        $scope.noMoreItemsAvailable = false;


        $scope.loadMore = function () {

            var minCommentTime = null;
            if ($scope.questions.length != 0) {
                minCommentTime = $scope.questions[$scope.questions.length - 1].commentTime;
            }
            $http.get(SERVER.url + '/comments/doctor', {
                params: {
                    doctor: $rootScope.user._id,
                    minCommentTime: minCommentTime
                }
            }).success(function (data) {
                if (data.length == 0)
                    $scope.noMoreItemsAvailable = true;
                $scope.questions = $scope.questions.concat(data);
                QuestionService.setData($scope.questions);

            }).error(function (reason) {
                //
                $ionicPopup.alert({
                    title: '错误',
                    template: error
                });
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.$on('$ionicView.enter', function () {
            $scope.doRefresh();
            QuestionService.setData($scope.questions);
            // do what you want to do
        })
        //
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