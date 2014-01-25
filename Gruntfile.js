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
            },
            markdown: {
                files: [
                    './README.md'
                ],
                task: ['markdown']
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
                clone: './.grunt',
                branch: 'gh-pages',
                base: './'
            },
            'gh-pages': {
                src: [
                    'jquery.tap.js',
                    '.gitignore',
                    'README.md',
                    'index.html'
                ]
            }
        },

        clean: {
            'gh-pages': {
                src: ['./.grunt']
            },
            markdown: {
                src: './index.html'
            }
        },

        markdown: {
            'gh-pages': {
                files: [
                    {
                        src: './README.md',
                        dest: './index.html'
                    }
                ],
                options: {
                    template: './markdown.template',
                    markdownOptions: {
                        highlight: 'manual',
                        gfm: true,
                        codeLines: {
                            before: '<div class="highlight">',
                            after: '</div>'
                        }
                    }
                }
            }
        }

    });

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('gh', ['markdown:gh-pages', 'clean:gh-pages', 'gh-pages', 'clean:gh-pages', 'clean:markdown']);
};
