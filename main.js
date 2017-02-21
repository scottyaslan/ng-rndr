require.config({
    waitSeconds: 200,
    baseUrl: 'ng-rndr/bower_components',
    paths: {
        //RequireJS plugins
        'async': 'requirejs-plugins/src/async',
        'font': 'requirejs-plugins/src/font',
        'goog': 'requirejs-plugins/src/goog',
        'propertyParser': 'requirejs-plugins/src/propertyParser',
        //3rd party JS libs
        'ace': 'ace-builds/src-min-noconflict/ace',
        'jquery': 'jquery/dist/jquery',
        'jquery-ui': 'jquery-ui/jquery-ui.min',
        'jquery-csv': 'jquery-csv/src/jquery.csv',
        'jquery-ui-touch-punch': 'jqueryui-touch-punch/jquery.ui.touch-punch.min',
        'datatables.net': 'datatables.net/js/jquery.dataTables.min',
        'datatables.net-keytable': 'datatables.net-keytable/js/dataTables.keyTable.min',
        'datatables.net-buttons': 'datatables.net-buttons/js/dataTables.buttons.min',
        'datatables.net-fixedcolumns': 'datatables.net-fixedcolumns/js/dataTables.fixedColumns.min',
        'datatables.net-buttons-print': 'datatables.net-buttons/js/buttons.print.min',
        'datatables.net-buttons-html5': 'datatables.net-buttons/js/buttons.html5.min',
        'downloadjs': 'downloadjs/download.min',
        'cyclejs': '../lib/cycle',
        'pdfmake': 'pdfmake/build/pdfmake.min',
        'vfs_fonts': 'pdfmake/build/vfs_fonts',
        'domReady': 'domready/ready',
        'fastclick': 'fastclick/lib/fastclick',
        'parallax': 'parallax/deploy/jquery.parallax.min',
        'jquery.contextMenu': 'jQuery-contextMenu/src/jquery.contextMenu',
        'gridster': 'gridster/dist/jquery.gridster',
        'ng-rndr': 'ng-rndr/dist/ng-rndr',
        'c3': 'c3/c3.min',
        'd3': 'd3/d3.min',
        //Angular and any 3rd party angular modules
        'angular': 'angular/angular.min',
        'angular-material': 'angular-material/angular-material',
        'angular-animate': 'angular-animate/angular-animate',
        'angular-aria': 'angular-aria/angular-aria',
        'angular-resource': 'angular-resource/angular-resource.min',
        'angular-route': 'angular-route/angular-route.min',
        'angular-ui-sortable': 'angular-ui-sortable/sortable',
        'angular-contextMenu': 'angularContextMenu/src/angular-contextMenu',
        'ui-ace': 'angular-ui-ace/ui-ace',
        //ng-rndr plugins
        'c3_renderers': 'ng-rndr/dist/plugins/renderers/c3_renderers',
        'd3_renderers': 'ng-rndr/dist/plugins/renderers/d3_renderers',
        'datatables_renderers': 'ng-rndr/dist/plugins/renderers/datatables_renderers',
        'pivottables_renderers': 'ng-rndr/dist/plugins/renderers/pivottables_renderers',
        'gchart_renderers': 'ng-rndr/dist/plugins/renderers/gchart_renderers',
        'PivotData': 'ng-rndr/dist/plugins/data_views/PivotData',
        'ngRndr.templates.aggregators': 'ng-rndr/dist/templates/aggregators.min',
        'ngRndr.templates.derivers': 'ng-rndr/dist/templates/derivers.min',
        'ngRndr.templates.formatters': 'ng-rndr/dist/templates/formatters.min'
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
        'c3_renderers': ['jquery', 'c3'],
        'd3_renderers': ['jquery', 'd3'],
        'pivottables_renderers': ['jquery'],
        'datatables_renderers': ['jquery', 'datatables.net', 'datatables.net-keytable', 'datatables.net-fixedcolumns', 'datatables.net-buttons-html5', 'datatables.net-buttons-print'],
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
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-material': ['angular', 'angular-animate', 'angular-aria'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-ui-sortable': ['angular', 'jquery-ui'],
        'angular-contextMenu': ['angular', 'jquery.contextMenu'],
        'ui-ace': ['angular', 'ace'],
        'ng-rndr': ['jquery', 'angular']
    },
    deps: ['../app']
});
