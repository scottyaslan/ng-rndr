define([], function() {
    'use strict';

    return function($window, $mdSidenav, $mdUtil, $mdBottomSheet, $mdDialog) {
        function uiControls() {
            this.bottomSheetTemplateUrl;
            this.dialogTemplateUrl;
            this.dialogTitle;
            this.init();
        };
        uiControls.prototype = {
            constructor: uiControls,
            init: function(bottomSheetTemplateUrl, dialogTemplateUrl) {
                if (bottomSheetTemplateUrl) {
                    uiControls.bottomSheetTemplateUrl = bottomSheetTemplateUrl;
                }
                if (dialogTemplateUrl) {
                    uiControls.dialogTemplateUrl = dialogTemplateUrl;
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
            openDialog: function(dialogTitle, dialogWidth) {
                uiControls.dialogTitle = dialogTitle;
                uiControls.dialogWidth = dialogWidth;
                $mdDialog.show({
                    controller: 'ControllerWrapper',
                    templateUrl: uiControls.dialogTemplateUrl,
                    parent: angular.element(document.body),
                    escapeToClose: false
                }).then(function(answer) {}, function() {});
            },
            showRenderingEngineProgress: function() {
                $("#rendererProgress").show();
                $("#renderer").hide();
            },
            hideRenderingEngineProgress: function() {
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
        var uiControls = new uiControls();
        return uiControls;
    }
});
