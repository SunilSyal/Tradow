angular.module('tradowApp').controller('AppCtrl', ['$rootScope', '$location', 'UserDetailsService', 'AlertService', 'LoadService', function($rootScope, $location, UserDetailsService, AlertService, LoadService) {
        var self = this;
        self.currentMenuIndex = 0;

        self.views = [
            ["Users", "users"],
            ["Plans", "plans"]
        ]

        

        self.selectedMenuIndex = function($index) {
            return self.currentMenuIndex == $index;
        }
        self.fnLoadView = function($index, view) {
            console.log(view)
            $location.path('/' + view);
            self.currentMenuIndex = $index
        }
    }])
    .controller('UserCtrl', ['CommonInfoService', 'PlanDetailsService', 'UserDetailsService', function(CommonInfoService, PlanDetailsService, UserDetailsService) {
        var fnResetNewUser, ComServ, planServ, userServ, self = this;
        ComServ = CommonInfoService
        planServ = PlanDetailsService;
        userServ = UserDetailsService;
        self.users = userServ.getUsersList;
        self.selectedUserDetails = userServ.getUserDetails;
        self.selectedUserKey ="";
        self.userSearchKey = "";
        self.selectedProjKey = "";
        self.selectedProjDetails = "";
        self.selectedUserProjKey = "";
        self.projectStatus = ComServ.getStatus;

        function fnResetNewUser() {
            self.newUserObj = {
                ID: "",
                NAME: "",
                EXP: "",
                SKILLS: ""
            }
        }
        fnResetNewUser();
        self.fnInvertProjectStatus = function (objRef){
            objRef.PROJSTATUS = (objRef.PROJSTATUS + 1) % 2;
        }
        self.fnInvertTaskStatus = function ($index){
            var arrRef = self.selectedProjDetails[self.selectedUserProjKey].PROGRESS;
            arrRef[$index] = (arrRef[$index] + 1) % 2;
        }
        self.fnSearchUser = function (){
            userServ.findUsers(self.userSearchKey)
        }

        self.fnShowUser = function(key) {
            self.selectedUserKey = key;
            self.selectedUser = self.users()[key];
            userServ.findUserDetails(key.split("_")[1]);
        }
        self.fnShowUserDetails = function(key) {
            console.log("fetch data for user: " + key)
            self.editUserFlag = false;
            self.showDetailsFlag = true;
            self.fnShowUser(key);
            $("#"+key).after($("#selectedUser"));
        }
        self.fnEditUser = function($event, key) {
            self.editUserFlag = true;
            self.showDetailsFlag = false;
            $event.stopPropagation();
            self.fnShowUser(key);
            $("#"+key).after($("#editedUser"));
        }

        self.fnCreateUser = function() {

        }

        self.fnUpdateUser = function (){
            userServ.update(self.selectedUserKey);
        }

        self.fnSaveUser = function($event) {
            $event.preventDefault();
            var newUserArr = {
                    NAME : self.newUserObj.NAME,
                    EXP : self.newUserObj.EXP,
                    SKILLS : self.newUserObj.SKILLS
            }
            var flag = userServ.save("USER_" + self.newUserObj.ID , newUserArr)
            if(flag){
                fnResetNewUser();
                setTimeout(function(){ 
                    $("#" + flag).fadeOut().fadeIn().fadeOut().fadeIn();
                }, 200);
                
                console.log("User added successfully.");
            }else{
                alert("User already exists.")
            }
            
        }
        self.fnChangeSaveState = function(){
            self.selectedUser.notSaved = true;
        }

        self.fnShowPlanDetails = function (key){
            self.selectedProjDetails = self.selectedUserDetails();
            self.selectedUserProjKey = key;
            self.selectedProjKey = key.split("_")[2];
            planServ.loadSinglePlan(self.selectedProjKey);
            self.selectedPlan = planServ.getPlan;
            $("#"+key).after($("#selectedPlan"));
        }
    }])
    .controller('PlanCtrl', ['$rootScope', 'PlanDetailsService', 'LoadService', function($rootScope, PlanDetailsService, LoadService) {
        var planServ, self = this;
        planServ = PlanDetailsService;
        LoadService.loadFile("db/shadowList.json").then(function(planData) {
            planServ.set(planData.data.SHADOWS);
            self.plans = planServ.get();
        }, function(err) {
            //AlertService.set(err.data.msg);
        });

        self.fnShowPlan = function(key) {
            self.selectedPlan = self.plans[key];
            $("#plan_" + key).after($("#selectedPlan"));
        }

        self.fnShowNewPlan = function(key) {
            self.selectedPlan = self.plans[key];
            $("#addPlan").before($("#selectedPlan"));
        }

        self.fnRemoveItem = function(index) {
            self.selectedPlan.ITEMS.splice(index, 1);
            self.fnChangeSaveState();
        }

        self.fnAddItem = function() {
            var obj = {
                "TITLE": "tile goes here",
                "DESC": "desc goes here"
            }
            self.selectedPlan.ITEMS.push(obj);
            self.fnChangeSaveState();
        }

        self.fnSavePlan = function() {
            console.log(self.plans);
            self.selectedPlan.notSaved = false;
            if (!!(self.selectedPlan.NEWPLAN)) {
                delete self.selectedPlan.NEWPLAN;
            }
            planServ.save(self.plans);
        }

        function fnNewPlanExists(){
            var i;
            for(i in self.plans){
                if(self.plans[i].NEWPLAN){
                    return [true, i];
                }
            }
            return [false, i];
        }

        self.fnAddPlan = function() {
            var ID, newPlan, len = self.plans.length;
            var existArr = fnNewPlanExists();

            if (existArr[0]) {
                self.fnShowPlan(existArr[1]);
                return;
            }

            ID = !!(existArr[1]) ? "S_" + (Number(existArr[1].split("_")[1]) + 1) : SHADOW_101;

            var obj = {
                "notSaved":true,
                "NEWPLAN": true,
                "INFO": {
                    "TITLE": "JS-Intermediate",
                    "TYPE": "Shadow",
                    "DESC": "JS, HTML, CSS"
                },
                "ITEMS": [{
                    "TITLE": "tile goes here",
                    "DESC": "desc goes here"
                }]
            }
            self.plans[ID] = obj;
            self.fnShowNewPlan(ID);
        }

        self.fnChangeSaveState = function(){
            self.selectedPlan.notSaved = true;
        }
    }]);

/*.controller('LandingCtrl', ['StockService', function (StockService) {
    var self = this;
    self.stocks = [];
    StockService.query().success(function (stocks) {
        self.stocks = stocks;
    });


}]).controller('AuthCtrl', ['AlertService', 'UserService', '$location', function (AlertService, UserService, $location) {
    var self = this;

    self.login = function () {
        UserService.login(self.username, self.password).then(function (user) {
            $location.path('/mine');
        }, function (err) {
            AlertService.set(err.msg);
        });
    };
    self.register = function () {
        UserService.register(self.username, self.password).then(function (user) {
            $location.path('/mine');
        }, function (err) {
            AlertService.set(err.data.msg);
        });
    };
}]).controller('MyStocksCtrl', ['StockService', function (StockService) {
    var self = this;
    self.stocks = [];
    self.fetchStocks = function (history, price, name) {
        console.log(price+"::"+ name)
        StockService.query().success(function (stocks) {
            self.stocks = stocks;
        });
    };
    self.fetchStocks();

    self.filters = {
        favorite: true
    };

    self.toggleFilter = function () {
        if (self.filters.favorite) {
            delete self.filters.favorite;
        } else {
            self.filters.favorite = true;
        }
    };
}]).controller('LogoutCtrl', ['UserService', '$location', function (UserService, $location) {
    var redirect = function () {
        $location.path('/');
    };
    UserService.logout().then(redirect, redirect);
}]);
*/
