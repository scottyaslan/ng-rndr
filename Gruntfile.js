module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    { expand: true, src: ['LICENSE'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, src: ['README.md'], dest: 'dist/', filter: 'isFile' },
                ]
            }
        },
        requirejs: {
            options: {
                baseUrl: "./src",
                out: './dist/ng-rndr.js',
                optimize: 'none',
                mainConfigFile: './src/ng-rndr.js',
                include: 'ng-rndr',
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
            my_target: {
                options: {
                    sourceMap: true
                },
                files: {
                    './dist/ng-rndr.min.js': ['./dist/ng-rndr.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dev', ['requirejs:dev']);
    grunt.registerTask('release', ['requirejs:dev', 'requirejs:release', 'uglify:my_target', 'copy:main']);
};
