define([], function() {
    'use strict';

    function UiControls($window, $mdSidenav, $mdUtil, $mdBottomSheet, $mdDialog) {
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

    return UiControls;
});