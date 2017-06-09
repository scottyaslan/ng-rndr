define([], function() {
    'use strict';

    return function($mdDialog) {
        function DialogControllerService() {
            this.dialogWidth;
            this.dialogAriaLabel;
            this.dialogTitle = 'Untitled';
        };
        DialogControllerService.prototype = {
            constructor: DialogControllerService,
            init: function(dialogWidth, dialogAriaLabel, dialogTitle) {
                if (dialogWidth) {
                    dialogControllerService.dialogWidth = dialogWidth;
                }
                if (dialogAriaLabel) {
                    dialogControllerService.dialogAriaLabel = dialogAriaLabel;
                }
                if (dialogTitle) {
                    dialogControllerService.dialogTitle = dialogTitle;
                }
            },
            openDialog: function(dialogTitle, dialogWidth) {
                dialogControllerService.dialogTitle = dialogTitle;
                dialogControllerService.dialogWidth = dialogWidth;
                var dialogTemplateUrl;
                if (dialogTitle === 'Filters') {
                    dialogTemplateUrl = 'renderers/angular/pivot-data/views/pivot-data-ui-filter-dialog-template-view.html'
                } else if(dialogTitle === 'Aggregate') {
                    dialogTemplateUrl = 'renderers/angular/pivot-data/views/pivot-data-ui-aggregator-dialog-template-view.html'
                }
                $mdDialog.show({
                    controller: 'pivotDataUIDialogController',
                    templateUrl: dialogTemplateUrl,
                    parent: angular.element(document.body),
                    escapeToClose: false,
                    multiple: true
                }).then(function(answer) {}, function() {});
            },
            hideDialog: function() {
                $mdDialog.hide();
            },
            cancelDialog: function() {
                $mdDialog.cancel();
            },
            answerDialog: function(answer) {
                $mdDialog.hide(answer);
            }
        };
        var dialogControllerService = new DialogControllerService();
        return dialogControllerService;
    };
});
