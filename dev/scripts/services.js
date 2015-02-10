angular.module('tradowApp')
    .factory('AlertService', function() {
        var message;
        return {
            set: function(msg) {
                message = msg;
            },
            clear: function() {
                message = null;
            },
            get: function() {
                return message;
            }
        };
    }).factory('LoadService', function($rootScope, $http) {
        var objJSON = {};
        //Gets the list of nuclear weapons
        objJSON.loadFile = function(filePath) {
            var myData = {};
            return $http.get(filePath);
        };
        return objJSON;
    }).factory('UserDetailsService', ['LoadService', function(LoadService) {
        var userObj = {};
        var userDetailsObj = {};
        return {
            setUsersList: function(obj) {
                userObj = obj;
            },
            getUsersList: function() {
                return userObj;
            },
            getUserDetails: function() {
                return userDetailsObj;
            },
            save: function(key, objRef) {
                if (userObj[key]) {
                    return false;
                }
                userObj[key] = objRef;
                return key;
            },
            update: function(key) {
                alert('Saved successfully.' + key)
            },
            findUsers: function(key) {
                LoadService.loadFile("db/users.json").then(function(res) {
                    userObj = res.data.USERS;
                }, function(err) {
                    //AlertService.set(err.data.msg);
                });
            },
            findUserDetails: function(key) {
                LoadService.loadFile("db/userProject.json").then(function(res) {

                    userDetailsObj = res.data.USER_PROJECT;
                    console.log(userDetailsObj)
                }, function(err) {
                    //AlertService.set(err.data.msg);
                });
            }
        };
    }]).factory('PlanDetailsService', ['LoadService', function(LoadService) {
        var allPlanObj = {};
        var singlePlanObj = {};
        return {
            set: function(obj) {
                allPlanObj = obj;
            },
            get: function() {
                var inUsePlanObj = JSON.parse(JSON.stringify(allPlanObj));
                allPlanObj = {};
                return inUsePlanObj;
            },
            save: function(objRef) {
                allPlanObj = objRef
                allPlanObj = {};
            },
            getPlan: function(ID) {
                return singlePlanObj["SHADOW_" + ID];
            },
            loadSinglePlan: function(ID) {
                if (!singlePlanObj["SHADOW_" + ID]) {
                    LoadService.loadFile("db/projectDetails.json").then(function(res) {
                            singlePlanObj["SHADOW_" + ID] = res.data["PROJECT_DETAILS"];
                        },
                        function(err) {
                            //AlertService.set(err.data.msg);
                        });
                }
            }
        }
    }]).factory('CommonInfoService', function() {
        var projectStatus = ["In Progress", "Complete"];
        return {
            getStatus: function(ID) {
                return projectStatus[ID];
            }
        };
    });
