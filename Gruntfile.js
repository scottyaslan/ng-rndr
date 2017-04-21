module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    { expand: true, src: ['LICENSE'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, src: ['README.md'], dest: 'dist/', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/PivotData.js'], dest: 'dist/plugins/pivot-data/PivotData.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/clone-data/CloneData.js'], dest: 'dist/plugins/clone-data/CloneData.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui-renderer.js'], dest: 'dist/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui-renderer.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/c3/c3_renderers.js'], dest: 'dist/plugins/pivot-data/renderers/c3/c3_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/d3/d3_renderers.js'], dest: 'dist/plugins/pivot-data/renderers/d3/d3_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/datatables/datatables_renderers.js'], dest: 'dist/plugins/pivot-data/renderers/datatables/datatables_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/datatables/datatables_renderers.css'], dest: 'dist/plugins/pivot-data/renderers/datatables/datatables_renderers.css', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/pivottables/pivottables_renderers.js'], dest: 'dist/plugins/pivot-data/renderers/pivottables/pivottables_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/pivottables/pivottables_renderers.css'], dest: 'dist/plugins/pivot-data/renderers/pivottables/pivottables_renderers.css', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui.css'], dest: 'dist/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui.css', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/pivot-data/renderers/google_chart/gchart_renderers.js'], dest: 'dist/plugins/pivot-data/renderers/google_chart/gchart_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/formatters.js'], dest: 'dist/plugins/formatters.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/sorters.js'], dest: 'dist/plugins/sorters.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/derived-attributes.js'], dest: 'dist/plugins/derived-attributes.js', filter: 'isFile' },
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
                src: ['src/plugins/pivot-data/renderers/pivot-data-ui/views/*.html'],
                dest: 'dist/ng-rndr-templates.js'
            }
        },
        requirejs: {
            options: {
                baseUrl: './src',
                out: './dist/ng-rndr.js',
                optimize: 'none',
                mainConfigFile: './src/ng-rndr.js',
                include: 'ng-rndr',
                paths: {
                    'jquery': 'empty:',
                    'angular': 'empty:',
                    '$ngRndrFormatters': 'empty:',
                    '$ngRndrSorters': 'empty:',
                    '$ngRndrDerivedAttributes': 'empty:'
                },
                name: '../node_modules/almond/almond',
                wrap: {
                    startFile: 'wrap.start',
                    endFile: 'wrap.end'
                }
            },
            dev: {
                options: {
                    optimize: 'none'
                }
            },
            release: {
                options: {
                    optimize: 'uglify',
                    out: './dist/ng-rndr.min.js'
                }
            }
        },
        uglify: {
            build: {
                options: {
                    sourceMap: true
                },
                files: [{
                    './dist/ng-rndr-templates.min.js': ['./dist/ng-rndr-templates.js'],
                    './dist/ng-rndr.min.js': ['./dist/ng-rndr.js'],
                    './dist/plugins/pivot-data/PivotData.min.js': ['./src/plugins/pivot-data/PivotData.js'],
                    './dist/plugins/clone-data/CloneData.min.js': ['./src/plugins/clone-data/CloneData.js'],
                    './dist/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui_renderer.min.js': ['./src/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui-renderer.js'],
                    './dist/plugins/pivot-data/renderers/c3/c3_renderers.min.js': ['./src/plugins/pivot-data/renderers/c3/c3_renderers.js'],
                    './dist/plugins/pivot-data/renderers/d3/d3_renderers.min.js': ['./src/plugins/pivot-data/renderers/d3/d3_renderers.js'],
                    './dist/plugins/pivot-data/renderers/datatables/datatables_renderers.min.js': ['./src/plugins/pivot-data/renderers/datatables/datatables_renderers.js'],
                    './dist/plugins/pivot-data/renderers/pivottables/pivottables_renderers.min.js': ['./src/plugins/pivot-data/renderers/pivottables/pivottables_renderers.js'],
                    './dist/plugins/pivot-data/renderers/google_chart/gchart_renderers.min.js': ['./src/plugins/pivot-data/renderers/google_chart/gchart_renderers.js'],
                    './dist/plugins/formatters.min.js': ['./src/plugins/formatters.js'],
                    './dist/plugins/sorters.min.js': ['./src/plugins/sorters.js'],
                    './dist/plugins/derived-attributes.min.js': ['./src/plugins/derived-attributes.js'],
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
                    './dist/plugins/pivot-data/renderers/datatables/datatables_renderers.min.css': ['./src/plugins/pivot-data/renderers/datatables/datatables_renderers.css'],
                    './dist/plugins/pivot-data/renderers/pivottables/pivottables_renderers.min.css': ['./src/plugins/pivot-data/renderers/pivottables/pivottables_renderers.css'],
                    './dist/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui.min.css': ['./src/plugins/pivot-data/renderers/pivot-data-ui/pivot-data-ui.css'],
                    './dist/ng-rndr.min.css': ['./src/ng-rndr.css']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release ng-rndr-%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'ng-rndr-%VERSION%',
                tagMessage: 'Version ng-rndr-%VERSION%',
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

    grunt.registerTask('dev', ['requirejs:dev', 'html2js:main']);
    grunt.registerTask('release', ['requirejs:dev', 'requirejs:release', 'uglify:build', 'copy:main', 'cssmin:target', 'html2js:main']);
};
