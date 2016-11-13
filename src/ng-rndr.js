define(['directives/rndr',
        'services/aggregators',
        'services/aggregatorTemplates',
        'services/dataViews',
        'services/renderers',
        'services/RenderingEngine',
        'services/RenderingEngines',
        'services/dataUtils',
        'services/DataSourceConfiguration',
        'services/dataSourceConfigurations',
        'services/DataSource',
        'services/dataSources'
    ],
    function(rndr,
        aggregators,
        aggregatorTemplates,
        dataViews,
        renderers,
        RenderingEngine,
        RenderingEngines,
        dataUtils,
        DataSourceConfiguration,
        dataSourceConfigurations,
        DataSource,
        dataSources) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        DataSourceConfiguration.$inject = ['ngRndr.dataUtils'];
        dataSourceConfigurations.$inject = ['ngRndr.DataSourceConfiguration'];
        DataSource.$inject = ['ngRndr.dataSourceConfigurations', '$q', '$rootScope', '$http'];
        dataSources.$inject = ['ngRndr.DataSource'];
        aggregators.$inject = ['ngRndr.aggregatorTemplates', 'ngRndr.dataUtils'];
        aggregatorTemplates.$inject = ['ngRndr.dataUtils'];
        dataViews.$inject = [];
        renderers.$inject = [];
        RenderingEngine.$inject = ['ngRndr.aggregators', 'ngRndr.dataUtils', 'ngRndr.renderers', 'ngRndr.dataViews', '$q', '$timeout', '$window', '$rootScope'];
        RenderingEngines.$inject = ['ngRndr.RenderingEngine', 'ngRndr.dataSourceConfigurations', 'ngRndr.dataSources', '$http'];
        dataUtils.$inject = [];

        // Module directives
        app.directive('rndr', rndr);

        // Module services
        app.service('ngRndr.DataSourceConfiguration', DataSourceConfiguration);
        app.service('ngRndr.dataSourceConfigurations', dataSourceConfigurations);
        app.service('ngRndr.DataSource', DataSource);
        app.service('ngRndr.dataSources', dataSources);
        app.service('ngRndr.aggregators', aggregators);
        app.service('ngRndr.aggregatorTemplates', aggregatorTemplates);
        app.service('ngRndr.dataViews', dataViews);
        app.service('ngRndr.renderers', renderers);
        app.service('ngRndr.RenderingEngine', RenderingEngine);
        app.service('ngRndr.RenderingEngines', RenderingEngines);
        app.service('ngRndr.dataUtils', dataUtils);
    });
