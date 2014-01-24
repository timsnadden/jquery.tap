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
        }

    });

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['uglify']);
};
