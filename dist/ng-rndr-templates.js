angular.module('ngRndrTemplates', []).run(['$templateCache', function($templateCache) {
  "use strict";
  $templateCache.put("renderers/angular/pivot-data/views/pivot-data-ui-aggregator-dialog-template-view.html",
    "<md-dialog flex={{dialogControllerService.dialogWidth}} layout=column tabindex=-1 aria-label={{dialogControllerService.dialogAriaLabel}}><form><md-toolbar class=md-accent><div class=md-toolbar-tools><h2>{{dialogControllerService.dialogTitle}}</h2><span flex></span><md-button class=md-icon-button ng-click=dialogControllerService.hideDialog(); aria-label=\"Close Dialog\"><md-tooltip>Close Dialog</md-tooltip><md-icon aria-label=\"Close dialog\">close</md-icon></md-button></div></md-toolbar><md-dialog-content flex layout=column><md-content layout-padding layout-align=\"space-around center\"><md-content layout=column><md-content layout=row><md-content flex=30 layout=column layout-align=\"start start\"><md-content><section><md-subheader class=md-primary>Select Aggregator</md-subheader></section></md-content></md-content><md-content flex=55 layout=column layout-fill layout-padding layout-align=\"start center\" ng-show=\"exploreController.embeddedRenderingEngine.aggregator.aggInputAttributeName.length > 0\" style=\"border-left: 1px solid #ccc\"><md-content><section><md-subheader class=md-primary>Select input attributes for the {{exploreController.embeddedRenderingEngine.aggregator.name}} aggregator:</md-subheader></section></md-content></md-content></md-content><md-content layout=row><md-content flex=30 layout=column layout-align=\"start start\"><md-content><section><md-list layout-padding><md-list-item class=md-3-line><md-input-container><md-select ng-model=exploreController.embeddedRenderingEngine.aggregator.name><md-option ng-click=\"exploreController.embeddedRenderingEngine.setAggregator(aggregatorName); exploreController.renderingEngine.setAggregator(aggregatorName);\" ng-repeat=\"aggregatorName in aggregators.list()\" value={{aggregatorName}}>{{aggregatorName}}</md-option></md-select></md-input-container></md-list-item></md-list></section></md-content></md-content><md-content flex=55 layout=column layout-fill layout-padding layout-align=\"start center\" ng-show=\"exploreController.embeddedRenderingEngine.aggregator.aggInputAttributeName.length > 0\" style=\"border-left: 1px solid #ccc\"><md-content><section><md-list layout-padding><md-list-item class=md-3-line ng-repeat=\"inputsToProcess in exploreController.embeddedRenderingEngine.aggregator.aggInputAttributeName track by $index\"><md-input-container><label>Attribute {{$index + 1}}</label><md-select ng-model=exploreController.embeddedRenderingEngine.aggregator.aggInputAttributeName[$index]><md-option ng-repeat=\"attributeName in exploreController.embeddedRenderingEngine.dataView.shownAttributes\" value={{attributeName}}>{{attributeName}}</md-option></md-select></md-input-container></md-list-item></md-list></section></md-content></md-content></md-content></md-content></md-content></md-dialog-content><md-content class=md-actions layout=row><md-content><md-content><md-button class=md-primary ng-click=dialogControllerService.hideDialog(); aria-label=\"Close Dialog\">Cancel</md-button><md-button ng-click=\"dialogControllerService.hideDialog(); \n" +
    "               exploreController.embeddedRenderingEngine.draw(exploreController.embeddedRenderingEngine.dataView.data);\" class=md-primary aria-label=Ok>Ok</md-button></md-content></md-content></md-content></form></md-dialog>");
  $templateCache.put("renderers/angular/pivot-data/views/pivot-data-ui-directive-view.html",
    "<md-content flex ng-controller=pivotDataUIController flex layout-fill layout=column tabindex=-1 role=main style=\"overflow: hidden\"><md-menu-bar class=md-whiteframe-z3 style=z-index:3><md-menu><button ng-click=$mdOpenMenu()>View</button><md-menu-content style=z-index:3><md-menu-item ng-repeat=\"rendererName in renderers.list()\"><md-button ng-click=\"exploreController.embeddedRenderingEngine.dataView.meta.renderer = rendererName;\n" +
    "                    exploreController.embeddedRenderingEngine.setRenderer(rendererName);\n" +
    "                    exploreController.embeddedRenderingEngine.draw(exploreController.embeddedRenderingEngine.dataView.data);\">{{rendererName}}</md-button></md-menu-item></md-menu-content></md-menu><md-menu><button ng-click=$mdOpenMenu()>Options</button><md-menu-content><md-menu-item><md-button ng-click=\"dialogControllerService.openDialog('Aggregate')\">Aggregate</md-button></md-menu-item><md-menu-item><md-button ng-click=\"dialogControllerService.openDialog('Filters')\">Filter</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><md-content id=explore flex layout=column tabindex=-1 role=main style=\"height: 100%\"><md-content layout=row flex id=content class=\"md-primary md-hue-1\"><md-content id=mainContent flex layout=column><div class=md-whiteframe-z3 id=attributes-container><header class=titlebar><div>Attributes</div></header><div class=dropzone ui-sortable=dropzone ng-model=exploreController.renderingEngine.dataView.attributesAvailableForRowsAndCols><ul ui-sortable=exploreController.constants.sortableOptions ng-model=exploreController.renderingEngine.dataView.attributesAvailableForRowsAndCols class=list><li class=placeholder ng-repeat=\"attribute in exploreController.renderingEngine.dataView.attributesAvailableForRowsAndCols\"><div class=pvtAttr><span ng-bind=attribute></span></div></li></ul></div></div><div class=md-whiteframe-z3 id=rows-container><header class=titlebar><div>Rows</div></header><div class=dropzone ui-sortable=dropzone ng-model=exploreController.renderingEngine.dataView.meta.rows><ul ui-sortable=exploreController.constants.sortableOptions ng-model=exploreController.renderingEngine.dataView.meta.rows class=list><li class=placeholder ng-repeat=\"attribute in exploreController.renderingEngine.dataView.meta.rows\"><div class=pvtAttr><span ng-bind=attribute></span></div></li></ul></div></div><div class=md-whiteframe-z3 id=columns-container><header class=titlebar><div>Columns</div></header><div class=dropzone ui-sortable=dropzone ng-model=exploreController.renderingEngine.dataView.meta.cols><ul ui-sortable=exploreController.constants.sortableOptions ng-model=exploreController.renderingEngine.dataView.meta.cols class=list><li class=placeholder ng-repeat=\"attribute in exploreController.renderingEngine.dataView.meta.cols\"><div class=pvtAttr><span ng-bind=attribute></span></div></li></ul></div></div><div class=md-whiteframe-z3 id=pivot-data-viz-container><header class=titlebar><div>Explore</div></header><div><rndr class=pivot-data-ui-rndr id=pivot-data-ui-rndr engine=exploreController.embeddedRenderingEngine input=exploreController.embeddedRenderingEngine.dataView.data></rndr></div></div></md-content></md-content></md-content></md-content>");
  $templateCache.put("renderers/angular/pivot-data/views/pivot-data-ui-filter-dialog-template-view.html",
    "<md-dialog flex={{dialogControllerService.dialogWidth}} layout=column tabindex=-1 aria-label={{dialogControllerService.dialogAriaLabel}}><form><md-toolbar class=md-accent><div class=md-toolbar-tools><h2>{{dialogControllerService.dialogTitle}}</h2><span flex></span><md-button class=md-icon-button ng-click=dialogControllerService.hideDialog(); aria-label=\"Close Dialog\"><md-tooltip>Close Dialog</md-tooltip><md-icon aria-label=\"Close dialog\">close</md-icon></md-button></div></md-toolbar><md-dialog-content flex layout=column><md-content layout-padding layout-align=\"space-around center\"><md-content flex layout=row layout-sm=column><md-content flex=30 layout=column layout-align=\"start start\"><md-content><section><md-subheader class=md-primary>Select Attribute to Filter</md-subheader><md-list layout-padding><md-list-item class=md-3-line><md-input-container><label>Filter</label><md-select ng-model=exploreController.renderingEngine.attributeFilterName><md-option ng-repeat=\"attributeName in exploreController.renderingEngine.dataView.shownAttributes\" value={{attributeName}}>{{attributeName}}</md-option></md-select></md-input-container></md-list-item></md-list></section></md-content></md-content><md-content flex=55 layout=column layout-fill layout-padding layout-align=\"start center\" style=\"border-left: 1px solid #ccc\"><md-content><section><md-subheader class=md-primary>Select which values will be available for {{exploreController.renderingEngine.attributeFilterName}}:</md-subheader><div ng-repeat=\"(key, value) in exploreController.renderingEngine.dataView.axisValues[exploreController.renderingEngine.attributeFilterName]\"><md-checkbox aria-label=Checkbox ng-checked=\"exploreController.isExcluded(exploreController.renderingEngine.attributeFilterName, key)\" ng-click=\"exploreController.renderingEngine.dataView.addExclusionFilter(exploreController.renderingEngine.attributeFilterName, key)\">{{key}}</md-checkbox></div></section></md-content></md-content></md-content></md-content></md-dialog-content><md-content class=md-actions layout=row><md-content><md-content><md-button class=md-primary ng-click=dialogControllerService.hideDialog(); aria-label=\"Close Dialog\">Cancel</md-button><md-button ng-click=\"dialogControllerService.hideDialog(); \n" +
    "               exploreController.embeddedRenderingEngine.draw(exploreController.embeddedRenderingEngine.dataView.data);\" class=md-primary aria-label=Ok>Ok</md-button></md-content></md-content></md-content></form></md-dialog>");
}]);
