/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define(['app', '../../common/controllers/controllerWrapper', '../../common/services/serviceProvider'], function(app) {
    app.factory('UiControls', ['ServiceProvider', '$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog',
        function(ServiceProvider, $window, $mdSidenav, $mdUtil, $mdBottomSheet, $mdDialog) {
            function UiControls() {
                this.bottomSheetTemplateUrl;
                this.dialogTemplateUrl;
                this.dialogTitle;
            };
            UiControls.prototype = {
                constructor: UiControls,
                init: function(bottomSheetTemplateUrl, dialogTemplateUrl) {
                    if(bottomSheetTemplateUrl){
                        uiControls.bottomSheetTemplateUrl = bottomSheetTemplateUrl;
                    }
                    if(dialogTemplateUrl){
                        uiControls.dialogTemplateUrl = dialogTemplateUrl;
                    }
                    if(ServiceProvider.UiControls === undefined){
                        ServiceProvider.add('UiControls', uiControls);
                    }
                },
                openMenu: function() {
                    $mdOpenMenu();
                },
                openBottomSheet: function() {
                    $mdBottomSheet.show({
                        templateUrl: uiControls.bottomSheetTemplateUrl,
                        controller: 'ControllerWrapper'
                    }).then(function(clickedItem) {});
                },
                openDialog: function(dialogTitle, ev) {
                    uiControls.dialogTitle = dialogTitle;
                    $mdDialog.show({
                        controller: 'ControllerWrapper',
                        templateUrl: uiControls.dialogTemplateUrl,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        escapeToClose: false
                    }).then(function(answer) {}, function() {});
                },
                showRenderingEngineProgress: function(){
                    $("#rendererProgress").show();
                    $("#renderer").hide();
                },
                hideRenderingEngineProgress: function(){
                    $("#rendererProgress").hide();
                    $("#renderer").show();
                },
                hideDialog: function() {
                    $mdDialog.hide();
                },
                cancelDialog: function() {
                    $mdDialog.cancel();
                },
                answerDialog: function(answer) {
                    $mdDialog.hide(answer);
                },
                closeLeftSideNav: function() {
                    uiControls.leftSideNavOpen = false;
                },
                openLeftSideNav: function() {
                    uiControls.leftSideNavOpen = true;
                },
                closeRightSideNav: function() {
                    uiControls.rightSideNavOpen = false;
                },
                openRightSideNav: function() {
                    uiControls.rightSideNavOpen = true;
                }
            };
            var uiControls = new UiControls();
            uiControls.init();
            return uiControls;
        }
    ]);
});