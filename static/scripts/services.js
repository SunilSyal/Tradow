angular.module('tradowApp')
   .factory('LoadService', function($rootScope, $http) {
        var objJSON = {};
        //Gets the list of nuclear weapons
        objJSON.loadFile = function(filePath) {
            var myData = {};
            return $http.get(filePath);
        };
        return objJSON;
    }).factory('projDetailsService', ['LoadService', function(LoadService) {
        var projObj = {};
        return {
            getUsersList: function() {
                return projObj;
            },
            loadProject: function() {
                //A parameter (project ID) will be paseed in case we are looking for users for selected project.
                LoadService.loadFile("JSON/projectDetails.json").then(function(res) {
                    projObj = res.data.SHADOW;
                }, function(err) {
                    //AlertService.set(err.data.msg);
                });
            }
        };
    }])
