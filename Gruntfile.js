module.exports = function(grunt) {
    grunt.initConfig({
        requirejs: {
            options: {
                baseUrl: "./data_analytics_toolkit/app",
                paths: {
                    'jquery': 'empty:',
                    // 'bower_components/angular-ui-ace/ui-ace': 'empty:',
                    // 'bower_components/angularContextMenu/src/angular-contextMenu': 'empty:',
                    // 'bower_components/angular-ui-sortable/sortable': 'empty:',
                    'c3': 'empty:',
                    'd3': 'empty:',
                },
                removeCombined: true,
                out: './data_analytics_toolkit/app/data-analytics-toolkit.js',
                optimize: 'none',
                name: 'data-analytics-toolkit-angular-module'
            },
            dev:{
                options:{
                    optimize:'none'
                }
            },
            release:{
                options:{
                    optimize:'uglify'
                }
              }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('dev',['requirejs:dev']);
    grunt.registerTask('release',['requirejs:release']);
};