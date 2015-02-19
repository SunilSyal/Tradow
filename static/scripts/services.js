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

        function fnAddEndDateField (){
            var startDate, len;
            len = projObj.INFO.length;
            startDate = Date.parse(projObj.STARTDATE);

            var dateString = projObj.STARTDATE
            var startDate = new Date(dateString);
            startDate = new Date((startDate.setDate(startDate.getDate() - 1)))
            
            for(var i=0;i<len;i++){
                var objRef = projObj.INFO[i];
                var workingDays = Number(objRef.DAYS);
                while(workingDays > 0){
                    startDate = new Date((startDate.setDate(startDate.getDate() + 1)))
                    if (startDate.getDay() == 0 || startDate.getDay() == 6){
                        continue;
                    }
                    workingDays--;
                }
                
                objRef.ENDDATE = startDate.toDateString();
            } 
        }
        return {
            getUsersList: function() {
                return projObj;
            },
            loadProject: function() {
                //A parameter (project ID) will be paseed in case we are looking for users for selected project.
                LoadService.loadFile("JSON/projectDetails.json").then(function(res) {
                    projObj = res.data.SHADOW;
                    fnAddEndDateField();
                }, function(err) {
                    //AlertService.set(err.data.msg);
                });
            }
        };
    }])
