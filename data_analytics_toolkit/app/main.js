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
require.config({
    waitSeconds: 200,
    paths: {
        //RequireJS plugins
        "async": "bower_components/requirejs-plugins/src/async",
        "font": "bower_components/requirejs-plugins/src/font",
        "goog": "bower_components/requirejs-plugins/src/goog",
        "propertyParser": "bower_components/requirejs-plugins/src/propertyParser",
        //3rd party JS libs
        "ace": "bower_components/ace-builds/src-min-noconflict/ace",
        "jquery": "bower_components/jquery/dist/jquery",
        "jquery-ui": "bower_components/jquery-ui/jquery-ui.min",
        "jquery-csv": "bower_components/jquery-csv/src/jquery.csv.min",
        "jquery-ui-touch-punch": "bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min",
        "datatables.net": "bower_components/datatables.net/js/jquery.dataTables.min",
        "datatables.net-keytable": "bower_components/datatables.net-keytable/js/dataTables.keyTable.min",
        "datatables.net-buttons": "bower_components/datatables.net-buttons/js/dataTables.buttons.min",
        "datatables.net-fixedcolumns": "bower_components/datatables.net-fixedcolumns/js/dataTables.fixedColumns.min",
        "datatables.net-buttons-print": "bower_components/datatables.net-buttons/js/buttons.print.min",
        "datatables.net-buttons-html5": "bower_components/datatables.net-buttons/js/buttons.html5.min",
        "pdfmake": "bower_components/pdfmake/build/pdfmake.min",
        "vfs_fonts": "bower_components/pdfmake/build/vfs_fonts",
        "domReady": "bower_components/domready/ready",
        "fastclick": "bower_components/fastclick/lib/fastclick",
        "parallax": "bower_components/parallax/deploy/jquery.parallax.min",
        "jquery.contextMenu": "bower_components/jQuery-contextMenu/src/jquery.contextMenu",
        "gridster": "bower_components/gridster/dist/jquery.gridster",
        "gchartRenderer": "../../render/plugins/dist/gchart_renderers.min",
        "c3": "bower_components/c3/c3.min",
        "d3": "bower_components/d3/d3.min",
        "C3Renderer": "../../render/plugins/dist/c3_renderers.min",
        "D3Renderer": "../../render/plugins/dist/d3_renderers.min",
        "datatablesRenderer": "../../render/plugins/dist/datatables_renderers.min",
        //Angular and any 3rd party angular modules
        "angular": "bower_components/angular/angular.min",
        "angularAMD": "bower_components/angularAMD/angularAMD",
        "angular-material": "bower_components/angular-material/angular-material",
        "angular-animate": "bower_components/angular-animate/angular-animate",
        "angular-aria": "bower_components/angular-aria/angular-aria",
        "angular-resource": "bower_components/angular-resource/angular-resource.min",
        "angular-route": "bower_components/angular-route/angular-route.min",
        "angular-ui-sortable": "bower_components/angular-ui-sortable/sortable",
        "angular-local-storage": "bower_components/angular-local-storage/dist/angular-local-storage",
        "angularContextMenu": "bower_components/angularContextMenu/src/angular-contextMenu",
        "ace-directive": "bower_components/angular-ui-ace/ui-ace",
        //Controllers
        "DATController": "controllers/DATController"
    },
    shim: {
        "font": ["goog", "propertyParser"],
        "goog": ["async", "propertyParser"],
        //3rd party JS libs
        "jquery-ui": ["jquery"],
        "jquery-csv": ["jquery"],
        "jquery-ui-touch-punch": ["jquery", "jquery-ui"],
        "parallax": ["jquery"],
        "gridster": ["jquery"],
        "gchartRenderer": ["goog!visualization,1,packages:[charteditor]"],
        "c3": ["d3"],
        "C3Renderer": ["c3"],
        "D3Renderer": ["d3"],
        "datatablesRenderer": ["datatables.net", "datatables.net-keytable", "datatables.net-fixedcolumns", "datatables.net-buttons-html5", "datatables.net-buttons-print"], 
        "datatables.net": ["jquery"],
        "datatables.net-fixedcolumns": ["datatables.net"],
        "datatables.net-keytable": ["datatables.net"],
        "datatables.net-buttons": ["datatables.net"],
        "datatables.net-buttons-print": ["datatables.net"],
        "datatables.net-buttons-html5": ["datatables.net", "datatables.net-buttons", "vfs_fonts"],
        "pdfmake": {           
            "exports": "pdfMake"
        },
        "vfs_fonts": {
            "deps": ["pdfmake"],
            "exports": "pdfMake"
        },
        "jquery.contextMenu": ["jquery", "jquery-ui"],
        //Angular and any 3rd party angular modules
        "angular": ["jquery", "jquery-csv"],
        "angular-resource": ["angular"],
        "angular-route": ["angular"],
        "angular-material": ["angular", "angular-animate", "angular-aria"],
        "angular-animate": ["angular"],
        "angular-aria": ["angular"],
        "angular-ui-sortable": ["angular", "jquery-ui"],
        "angularContextMenu": ["angular", "jquery.contextMenu"],
        "angularAMD": ["angular"],
        "angular-local-storage": ["angular"],
        "ace-directive": ["angular", "ace"]
    },
    deps: ["app"]
});