angular.module('tradowApp',  ['ngSanitize']).controller('AppCtrl', ['projDetailsService', function(projDetailsService) {
        var projServ, self = this;
        projServ = projDetailsService;

        self.projDetails = projServ.getUsersList;
        projServ.loadProject();

    }]);

