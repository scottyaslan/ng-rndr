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

    grunt.registerTask('dev', ['requirejs:dev']);
    grunt.registerTask('release', ['requirejs:dev', 'requirejs:release', 'uglify:my_target', 'copy:main']);
};
