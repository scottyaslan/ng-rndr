module.exports = function(grunt) {
    grunt.initConfig({
        html2js: {
            options: {
                base: "./src",
                module: 'ngRndr.templates',
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
              src: ['src/acquire/**/*.html', 'src/explore/**/*.html'],
              dest: 'dist/rndr-templates.js'
            }
        },
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
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('dev',['requirejs:dev', 'html2js:main']);
    grunt.registerTask('release',['requirejs:release']);
};