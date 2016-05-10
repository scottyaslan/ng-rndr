module.exports = function(grunt) {
    grunt.initConfig({
        requirejs: {
            options: {
                baseUrl: "./src",
                paths: {
                    'jquery': 'empty:',
                    'c3': 'empty:',
                    'd3': 'empty:',
                },
                removeCombined: true,
                out: './dist/rndr.js',
                optimize: 'none',
                name: 'rndr-angular-module'
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