define(['render/directives/renderingEngineDirective',
        'render/services/aggregators',
        'render/services/aggregatorTemplates',
        'render/services/dataViews',
        'render/services/renderers',
        'render/services/RenderingEngine',
        'render/services/RenderingEngines',
        'render/services/dataUtils',
        'render/services/DataSourceConfiguration',
        'render/services/dataSourceConfigurationManager',
        'render/services/DataSource',
        'render/services/dataSourceManager'
    ],
    function(renderingEngineDirective,
        aggregators,
        aggregatorTemplates,
        dataViews,
        renderers,
        RenderingEngine,
        RenderingEngines,
        dataUtils,
        DataSourceConfiguration,
        dataSourceConfigurationManager,
        DataSource,
        dataSourceManager) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        renderingEngineDirective.$inject = [];
        DataSourceConfiguration.$inject = ['ngRndr.dataUtils'];
        dataSourceConfigurationManager.$inject = ['ngRndr.DataSourceConfiguration'];
        DataSource.$inject = ['ngRndr.dataSourceConfigurationManager', '$q', '$rootScope', '$http'];
        dataSourceManager.$inject = ['ngRndr.DataSource'];
        aggregators.$inject = ['ngRndr.aggregatorTemplates', 'ngRndr.dataUtils'];
        aggregatorTemplates.$inject = ['ngRndr.dataUtils'];
        dataViews.$inject = [];
        renderers.$inject = [];
        RenderingEngine.$inject = ['ngRndr.aggregators', 'ngRndr.dataUtils', 'ngRndr.renderers', 'ngRndr.dataViews', '$q', '$timeout', '$window', '$rootScope'];
        RenderingEngines.$inject = ['ngRndr.RenderingEngine', 'ngRndr.dataSourceConfigurationManager', 'ngRndr.dataSourceManager', '$http'];
        dataUtils.$inject = [];

        // Module directives
        app.directive('renderingEngineDirective', renderingEngineDirective);

        // Module services
        app.service('ngRndr.DataSourceConfiguration', DataSourceConfiguration);
        app.service('ngRndr.dataSourceConfigurationManager', dataSourceConfigurationManager);
        app.service('ngRndr.DataSource', DataSource);
        app.service('ngRndr.dataSourceManager', dataSourceManager);
        app.service('ngRndr.aggregators', aggregators);
        app.service('ngRndr.aggregatorTemplates', aggregatorTemplates);
        app.service('ngRndr.dataViews', dataViews);
        app.service('ngRndr.renderers', renderers);
        app.service('ngRndr.RenderingEngine', RenderingEngine);
        app.service('ngRndr.RenderingEngines', RenderingEngines);
        app.service('ngRndr.dataUtils', dataUtils);
    });
