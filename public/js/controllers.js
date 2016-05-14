'use strict';

var app = angular.module('myApp');


app.controller('mainCtrl', function($http, $scope, Auth, $state) {
    console.log('mainCtrl loaded');
    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
        // rootCtrl's scope is basically $rootScope
        console.log('user is logged in.');
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.logIn = (loginInfo) => {
        Auth.login(loginInfo)
            .then(function(res) {
                $scope.currentUser = res.data;
                $scope.loginInfo = null;
            }, function(err) {
                console.log('err: ', err);
            })
    }
    $scope.logOut = () => {
        console.log('Out');
        Auth.logout()
            .then(function(res) {
                $scope.currentUser = null;
                $scope.loginInfo = null;
                $state.go('/');
            }, function(err) {
                console.log('err: ', err);
            })
    }
    $scope.signUp = (newUser) => {
        console.log('create');
        console.log(newUser);
        Auth.register(newUser)
            .then(function(res) {
                console.log(res);
                $scope.newUser = null;
                $scope.logIn(newUser);
                $state.go('home');
            }, function(err) {
                console.log('err: ', err);

            })
    }
});
app.controller('homeCtrl', function($http, $scope, Auth) {
    console.log('homeCtrl loaded');
    // $scope.logMsg.err = '';

    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
    }, function(err) {
        console.log('user is not logged in.');
    });
});
app.controller('communityCtrl', function($http, $scope, Auth) {
    console.log('communityCtrl loaded');
    $http.get('/api/users').then(function(res) {
        $scope.users = res.data;
    }, function(err) {
        console.log('users are not found.');
    });
});
app.controller('profileCtrl', function($http, User, $scope, $stateParams) {
    console.log('profileCtrl loaded');
    console.log($stateParams.userId);
    User.getProfileById($stateParams.userId).then(function(res) {
        console.log(res.data);
        $scope.user = res.data;
    }, function(err) {
        console.log('user are not found.');
    });
});
app.controller('profileSettingCtrl', function($http, $scope, Auth, User) {
    console.log('profileCtrl loaded');
    console.log($scope.currentUser);
    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
        $scope.settingProfile = angular.copy($scope.currentUser);
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.settingProfileSubmitted = () => {
        console.log($scope.settingProfile);
        User.editProfile($scope.settingProfile).then(function(res) {
            $scope.currentUser = $scope.settingProfile;
        }, function(err) {
            console.log('user is not logged in.');
        })
    }
});
app.controller('wallCtrl', function($http, $scope, Auth, User, Post) {
    console.log('wallCtrl loaded');
    $http.get('/api/users/posts').then(function(res) {
        var posts = res.data.reverse();
        $scope.posts = posts;
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.postSubmit = () => {
        console.log('post');
        var userId = $scope.currentUser._id;
        var body = $scope.post.body;
        console.log(userId, body);
        Post.post(userId, body).then(function(res) {
            console.log(res.data);
            $scope.posts.unshift(res.data);
            $scope.post = null;
        }, function(err) {
            console.log(err);
        })

    }
    $scope.like = (post) => {

        var userId = $scope.currentUser._id;
        var postId = post._id;
        console.log(userId, postId);
        console.log(post);

        Post.like(userId, postId).then(function(res) {
            console.log(res.data);
            check(post, userId);
        }, function(err) {
            console.log(err);
        })
    };
    $scope.thumbUp = (likes) => {
        var userId = $scope.currentUser._id;
        if (likes.indexOf(userId) == -1) {
            return false;
        } else if(likes.indexOf(userId) > -1){
            return true;
        }
    };
    function check(post, userId){
        var index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
    }
});
