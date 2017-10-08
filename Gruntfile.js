module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    { expand: true, src: ['LICENSE'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, src: ['README.md'], dest: 'dist/', filter: 'isFile' },
                    { expand: false, src: ['src/RenderingEngine.js'], dest: 'dist/RenderingEngine.js', filter: 'isFile' },
                    { expand: false, src: ['src/RenderingEngines.js'], dest: 'dist/RenderingEngines.js', filter: 'isFile' },
                    { expand: false, src: ['src/data-views/pivot-data/PivotData.js'], dest: 'dist/data-views/pivot-data/PivotData.js', filter: 'isFile' },
                    { expand: false, src: ['src/data-views/clone-data/CloneData.js'], dest: 'dist/data-views/clone-data/CloneData.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/angular/pivot-data/pivot-data-ui-renderer.js'], dest: 'dist/renderers/angular/pivot-data/pivot-data-ui-renderer.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/angular/pivot-data/pivot-data-ui.css'], dest: 'dist/renderers/angular/pivot-data/pivot-data-ui.css', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/c3/pivot-data/c3-renderers.js'], dest: 'dist/renderers/c3/pivot-data/c3-renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/d3/pivot-data/d3-renderers.js'], dest: 'dist/renderers/d3/pivot-data/d3-renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/datatables/pivot-data/datatables-renderers.js'], dest: 'dist/renderers/datatables/pivot-data/datatables-renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/datatables/pivot-data/datatables-renderers.css'], dest: 'dist/renderers/datatables/pivot-data/datatables-renderers.css', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/pivottables/pivot-data/pivottables-renderers.js'], dest: 'dist/renderers/pivottables/pivot-data/pivottables-renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/pivottables/pivot-data/pivottables-renderers.css'], dest: 'dist/renderers/pivottables/pivot-data/pivottables-renderers.css', filter: 'isFile' },
                    { expand: false, src: ['src/renderers/google-chart/pivot-data/gchart-renderers.js'], dest: 'dist/renderers/google-chart/pivot-data/gchart-renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/formatters.js'], dest: 'dist/plugins/formatters.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/sorters.js'], dest: 'dist/plugins/sorters.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/derived-attributes.js'], dest: 'dist/plugins/derived-attributes.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/aggregators.js'], dest: 'dist/plugins/aggregators.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/data-views.js'], dest: 'dist/plugins/data-views.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers.js'], dest: 'dist/plugins/renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/aggregators.js'], dest: 'dist/templates/aggregators.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/derivers.js'], dest: 'dist/templates/derivers.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/formatters.js'], dest: 'dist/templates/formatters.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/sorters.js'], dest: 'dist/templates/sorters.js', filter: 'isFile' }
                ]
            }
        },
        html2js: {
            options: {
                base: "./src",
                module: 'ngRndrTemplates',
                singleModule: true,
                useStrict: true,
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                src: ['src/renderers/angular/pivot-data/views/*.html'],
                dest: 'dist/ng-pivot-data-templates.js'
            }
        },
        requirejs: {
            options: {
                baseUrl: './src',
                name: '../node_modules/almond/almond'
            },
            ngRndr: {
                options: {
                    optimize: 'none',
                    out: './dist/ng-rndr.js',
                    mainConfigFile: './src/ng-rndr.js',
                    paths: {
                        'jquery': 'empty:',
                        'angular': 'empty:',
                        'rndr': 'empty:'
                    },
                    include: 'ng-rndr',
                    wrap: {
                        startFile: 'ng-rndr-wrap.start',
                        endFile: 'ng-rndr-wrap.end'
                    }
                }
            },
            ngRndrUgly: {
                options: {
                    optimize: 'uglify',
                    out: './dist/ng-rndr.min.js',
                    mainConfigFile: './src/ng-rndr.js',
                    paths: {
                        'jquery': 'empty:',
                        'angular': 'empty:',
                        'rndr': 'empty:'
                    },
                    include: 'ng-rndr',
                    wrap: {
                        startFile: 'ng-rndr-wrap.start',
                        endFile: 'ng-rndr-wrap.end'
                    }
                }
            },
            rndr: {
                options: {
                    optimize: 'none',
                    out: './dist/rndr.js',
                    mainConfigFile: './src/rndr.js',
                    paths: {
                        'jquery': 'empty:',
                        '$rndrFormattersTemplates': 'templates/formatters',
                        '$rndrFormatters': 'plugins/formatters',
                        '$rndrSortersTemplates': 'templates/sorters',
                        '$rndrSorters': 'plugins/sorters',
                        '$rndrDeriverTemplates': 'templates/derivers',
                        '$rndrDerivedAttributes': 'plugins/derived-attributes',
                        '$rndrAggregatorsTemplates': 'templates/aggregators',
                        '$rndrAggregators': 'plugins/aggregators',
                        '$rndrDataViews': 'plugins/data-views',
                        '$rndrRenderers': 'plugins/renderers',
                        '$rndrPivotData': 'data-views/pivot-data/PivotData',
                        'rndrRenderingEngine': 'RenderingEngine'
                    },
                    include: 'rndr',
                    wrap: {
                        startFile: 'rndr-wrap.start',
                        endFile: 'rndr-wrap.end'
                    }
                }
            },
            rndrUgly: {
                options: {
                    optimize: 'uglify',
                    out: './dist/rndr.min.js',
                    mainConfigFile: './src/rndr.js',
                    paths: {
                        'jquery': 'empty:',
                        '$rndrFormattersTemplates': 'templates/formatters',
                        '$rndrFormatters': 'plugins/formatters',
                        '$rndrSortersTemplates': 'templates/sorters',
                        '$rndrSorters': 'plugins/sorters',
                        '$rndrDeriverTemplates': 'templates/derivers',
                        '$rndrDerivedAttributes': 'plugins/derived-attributes',
                        '$rndrAggregatorsTemplates': 'templates/aggregators',
                        '$rndrAggregators': 'plugins/aggregators',
                        '$rndrDataViews': 'plugins/data-views',
                        '$rndrRenderers': 'plugins/renderers',
                        '$rndrPivotData': 'data-views/pivot-data/PivotData',
                        'rndrRenderingEngine': 'RenderingEngine'
                    },
                    include: 'rndr',
                    wrap: {
                        startFile: 'rndr-wrap.start',
                        endFile: 'rndr-wrap.end'
                    }
                }
            }
        },
        uglify: {
            build: {
                options: {
                    sourceMap: true
                },
                files: [{
                    './dist/ng-pivot-data-templates.min.js': ['./dist/ng-pivot-data-templates.js'],
                    './dist/ng-rndr.min.js': ['./dist/ng-rndr.js'],
                    './dist/rndr.min.js': ['./dist/rndr.js'],
                    './dist/RenderingEngine.min.js': ['./src/RenderingEngine.js'],
                    './dist/data-views/pivot-data/PivotData.min.js': ['./src/data-views/pivot-data/PivotData.js'],
                    './dist/data-views/clone-data/CloneData.min.js': ['./src/data-views/clone-data/CloneData.js'],
                    './dist/renderers/angular/pivot-data/pivot-data-ui_renderer.min.js': ['./src/renderers/angular/pivot-data/pivot-data-ui-renderer.js'],
                    './dist/renderers/c3/pivot-data/c3-renderers.min.js': ['./src/renderers/c3/pivot-data/c3-renderers.js'],
                    './dist/renderers/d3/pivot-data/d3-renderers.min.js': ['./src/renderers/d3/pivot-data/d3-renderers.js'],
                    './dist/renderers/datatables/pivot-data/datatables-renderers.min.js': ['./src/renderers/datatables/pivot-data/datatables-renderers.js'],
                    './dist/renderers/pivottables/pivot-data/pivottables-renderers.min.js': ['./src/renderers/pivottables/pivot-data/pivottables-renderers.js'],
                    './dist/renderers/google-chart/pivot-data/gchart-renderers.min.js': ['./src/renderers/google-chart/pivot-data/gchart-renderers.js'],
                    './dist/plugins/formatters.min.js': ['./src/plugins/formatters.js'],
                    './dist/plugins/sorters.min.js': ['./src/plugins/sorters.js'],
                    './dist/plugins/derived-attributes.min.js': ['./src/plugins/derived-attributes.js'],
                    './dist/plugins/aggregators.min.js': ['./src/plugins/aggregators.js'],
                    './dist/plugins/data-views.min.js': ['./src/plugins/data-views.js'],
                    './dist/plugins/renderers.min.js': ['./src/plugins/renderers.js'],
                    './dist/templates/aggregators.min.js': ['./src/templates/aggregators.js'],
                    './dist/templates/derivers.min.js': ['./src/templates/derivers.js'],
                    './dist/templates/formatters.min.js': ['./src/templates/formatters.js'],
                    './dist/templates/sorters.min.js': ['./src/templates/sorters.js']
                }]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './dist/renderers/datatables/pivot-data/datatables-renderers.min.css': ['./src/renderers/datatables/pivot-data/datatables-renderers.css'],
                    './dist/renderers/pivottables/pivot-data/pivottables-renderers.min.css': ['./src/renderers/pivottables/pivot-data/pivottables-renderers.css'],
                    './dist/renderers/angular/pivot-data/pivot-data-ui-renderer.min.css': ['./src/renderers/angular/pivot-data/pivot-data-ui-renderer.css'],
                    './dist/rndr.min.css': ['./src/rndr.css']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release rndr-%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'rndr-%VERSION%',
                tagMessage: 'Version rndr-%VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: 'RC',
                metadata: '',
                regExp: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('dev', ['requirejs:ngRndr', 'html2js:main']);
    grunt.registerTask('release', ['requirejs:rndr', 'requirejs:ngRndr', 'html2js:main', 'requirejs:rndrUgly', 'requirejs:ngRndrUgly', 'uglify:build', 'copy:main', 'cssmin:target']);
};
