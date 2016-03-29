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
        'async': '../../../data_analytics_toolkit/app/bower_components/requirejs-plugins/src/async',
        'font': '../../../data_analytics_toolkit/app/bower_components/requirejs-plugins/src/font',
        'goog': '../../../data_analytics_toolkit/app/bower_components/requirejs-plugins/src/goog',
        'propertyParser': '../../../data_analytics_toolkit/app/bower_components/requirejs-plugins/src/propertyParser',
        //3rd party JS libs
        'ace': '../../../data_analytics_toolkit/app/bower_components/ace-builds/src-min-noconflict/ace',
        'jquery': '../../../data_analytics_toolkit/app/bower_components/jquery/dist/jquery',
        'jquery-ui': '../../../data_analytics_toolkit/app/bower_components/jquery-ui/jquery-ui.min',
        'jquery-csv': '../../../data_analytics_toolkit/app/bower_components/jquery-csv/src/jquery.csv.min',
        'jquery-ui-touch-punch': '../../../data_analytics_toolkit/app/bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
        'datatables.net': '../../../data_analytics_toolkit/app/bower_components/datatables.net/js/jquery.dataTables.min',
        'datatables.net-keytable': '../../../data_analytics_toolkit/app/bower_components/datatables.net-keytable/js/dataTables.keyTable.min',
        'datatables.net-buttons': '../../../data_analytics_toolkit/app/bower_components/datatables.net-buttons/js/dataTables.buttons.min',
        'datatables.net-fixedcolumns': '../../../data_analytics_toolkit/app/bower_components/datatables.net-fixedcolumns/js/dataTables.fixedColumns.min',
        'datatables.net-buttons-print': '../../../data_analytics_toolkit/app/bower_components/datatables.net-buttons/js/buttons.print.min',
        'datatables.net-buttons-html5': '../../../data_analytics_toolkit/app/bower_components/datatables.net-buttons/js/buttons.html5.min',
        'pdfmake': '../../../data_analytics_toolkit/app/bower_components/pdfmake/build/pdfmake.min',
        'vfs_fonts': '../../../data_analytics_toolkit/app/bower_components/pdfmake/build/vfs_fonts',
        'domReady': '../../../data_analytics_toolkit/app/bower_components/domready/ready',
        'fastclick': '../../../data_analytics_toolkit/app/bower_components/fastclick/lib/fastclick',
        'parallax': '../../../data_analytics_toolkit/app/bower_components/parallax/deploy/jquery.parallax.min',
        'jquery.contextMenu': '../../../data_analytics_toolkit/app/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
        'gridster': '../../../data_analytics_toolkit/app/bower_components/gridster/dist/jquery.gridster',
        'data-analytics-toolkit-angular-module': '../../../data_analytics_toolkit/app/data-analytics-toolkit',
        'c3': '../../../data_analytics_toolkit/app/bower_components/c3/c3.min',
        'd3': '../../../data_analytics_toolkit/app/bower_components/d3/d3.min',
        //Angular and any 3rd party angular modules
        'angular': '../../../data_analytics_toolkit/app/bower_components/angular/angular.min',
        'angular-material': '../../../data_analytics_toolkit/app/bower_components/angular-material/angular-material',
        'angular-animate': '../../../data_analytics_toolkit/app/bower_components/angular-animate/angular-animate',
        'angular-aria': '../../../data_analytics_toolkit/app/bower_components/angular-aria/angular-aria',
        'angular-resource': '../../../data_analytics_toolkit/app/bower_components/angular-resource/angular-resource.min',
        'angular-route': '../../../data_analytics_toolkit/app/bower_components/angular-route/angular-route.min',
        'angular-ui-sortable': '../../../data_analytics_toolkit/app/bower_components/angular-ui-sortable/sortable',
        'angular-local-storage': '../../../data_analytics_toolkit/app/bower_components/angular-local-storage/dist/angular-local-storage'
    },
    shim: {
        'font': ['goog', 'propertyParser'],
        'goog': ['async', 'propertyParser'],
        //3rd party JS libs
        'jquery-ui': ['jquery'],
        'jquery-csv': ['jquery'],
        'jquery-ui-touch-punch': ['jquery', 'jquery-ui'],
        'parallax': ['jquery'],
        'gridster': ['jquery'],
        'c3': ['d3'],
        '../../../render/plugins/dist/gchart_renderers.min': ['goog!visualization,1,packages:[charteditor]'],
        '../../../render/plugins/dist/c3_renderers.min': ['c3'],
        '../../../render/plugins/dist/d3_renderers.min': ['d3'],
        '../../../render/plugins/dist/datatables_renderers.min': ['datatables.net', 'datatables.net-keytable', 'datatables.net-fixedcolumns', 'datatables.net-buttons-html5', 'datatables.net-buttons-print'], 
        'datatables.net': ['jquery'],
        'datatables.net-fixedcolumns': ['datatables.net'],
        'datatables.net-keytable': ['datatables.net'],
        'datatables.net-buttons': ['datatables.net'],
        'datatables.net-buttons-print': ['datatables.net'],
        'datatables.net-buttons-html5': ['datatables.net', 'datatables.net-buttons', 'vfs_fonts'],
        'pdfmake': {           
            'exports': 'pdfMake'
        },
        'vfs_fonts': {
            'deps': ['pdfmake'],
            'exports': 'pdfMake'
        },
        'jquery.contextMenu': ['jquery', 'jquery-ui'],
        //Angular and any 3rd party angular modules
        'angular': ['jquery', 'jquery-csv'],
        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-material': ['angular', 'angular-animate', 'angular-aria'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        '../../../data_analytics_toolkit/app/bower_components/angular-ui-sortable/sortable': ['angular', 'jquery-ui'],
        '../../../data_analytics_toolkit/app/bower_components/angularContextMenu/src/angular-contextMenu': ['angular', 'jquery.contextMenu'],
        'angular-local-storage': ['angular'],
        '../../../data_analytics_toolkit/app/bower_components/angular-ui-ace/ui-ace': ['angular', 'ace'],
        // 'TheApp': ['data-analytics-toolkit'],
        'data-analytics-toolkit-angular-module': ['angular', 'angular-route', 'angular-material', 'angular-resource', 'angular-local-storage', 'parallax', '../../../data_analytics_toolkit/app/bower_components/angularContextMenu/src/angular-contextMenu', '../../../../render/plugins/dist/gchart_renderers.min', 'datatables.net', 'gridster', '../../../data_analytics_toolkit/app/bower_components/angular-ui-sortable/sortable', '../../../data_analytics_toolkit/app/bower_components/angular-ui-ace/ui-ace']
    },
    deps: ['app']
});