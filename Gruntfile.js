module.exports = function(grunt) {
    'use strict';

    // -- Plugins --------------------------------------------------------------

    // Intelligently autoloads `grunt-*` plugins from the package dependencies.
    require('load-grunt-tasks')(grunt);

    // -- Configuration --------------------------------------------------------

    grunt.initConfig({

        watch: {
            scripts: {
                files: [
                    './jquery.tap.js',
                    './Gruntfile.js'
                ],
                tasks: ['build']
            }
        },

        uglify: {
            options: {
            },
            minify: {
                files: {
                    './jquery.tap.min.js': ['./jquery.tap.js']
                }
            }
        },

        'gh-pages': {
            options: {
                add: true,
                branch: 'gh-pages',
                base: './'
            },
            'gh-pages': {
                src: ['jquery.tap.js', 'jquery.tap.min.js', '.gitignore', 'Gruntfile.js', 'package.json']
            }
        },

        clean: {
            'gh-pages': {
                src: ['./.grunt']
            }
        }

    });

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('gh', ['gh-pages', 'clean:gh-pages']);
};
