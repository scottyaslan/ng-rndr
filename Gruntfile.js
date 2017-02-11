module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    { expand: true, src: ['LICENSE'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, src: ['README.md'], dest: 'dist/', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/data_views/PivotData.js'], dest: 'dist/plugins/data_views/PivotData.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/data_views/CloneData.js'], dest: 'dist/plugins/data_views/CloneData.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers/c3_renderers.js'], dest: 'dist/plugins/renderers/c3_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers/d3_renderers.js'], dest: 'dist/plugins/renderers/d3_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers/datatables_renderers.js'], dest: 'dist/plugins/renderers/datatables_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers/datatables_renderers.css'], dest: 'dist/plugins/renderers/datatables_renderers.css', filter: 'isFile' },
                    { expand: false, src: ['src/plugins/renderers/gchart_renderers.js'], dest: 'dist/plugins/renderers/gchart_renderers.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/aggregators.js'], dest: 'dist/templates/aggregators.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/derivers.js'], dest: 'dist/templates/derivers.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/formatters.js'], dest: 'dist/templates/formatters.js', filter: 'isFile' },
                    { expand: false, src: ['src/templates/sorters.js'], dest: 'dist/templates/sorters.js', filter: 'isFile' }
                ]
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
                    'ngRndr.dataUtils': 'empty:',
                    'jquery': 'empty:',
                    'angular': 'empty:'
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
                    './dist/ng-rndr.min.js': ['./dist/ng-rndr.js'],
                    './dist/plugins/data_views/PivotData.min.js': ['./src/plugins/data_views/PivotData.js'],
                    './dist/plugins/data_views/CloneData.min.js': ['./src/plugins/data_views/CloneData.js'],
                    './dist/plugins/renderers/c3_renderers.min.js': ['./src/plugins/renderers/c3_renderers.js'],
                    './dist/plugins/renderers/d3_renderers.min.js': ['./src/plugins/renderers/d3_renderers.js'],
                    './dist/plugins/renderers/datatables_renderers.min.js': ['./src/plugins/renderers/datatables_renderers.js'],
                    './dist/plugins/renderers/gchart_renderers.min.js': ['./src/plugins/renderers/gchart_renderers.js'],
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
                    './dist/plugins/renderers/datatables_renderers.min.css': ['./src/plugins/renderers/datatables_renderers.css']
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
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('dev', ['requirejs:dev']);
    grunt.registerTask('release', ['requirejs:dev', 'requirejs:release', 'uglify:build', 'copy:main', 'cssmin:target']);
};
