module.exports = function(grunt) {
    'use strict';

    var git = {

        exec: function(command, callback) {
            if (grunt.util.kindOf(command) !== 'array') {
                grunt.fail.fatal('Invalid command argument type. Must be string or array')
            }

            grunt.util.spawn({
                cmd: 'gig',
                args: command
            }, callback);
        },

        commit: function(message, callback) {
            git.exec(['commit', '-m', message], callback);
        },

        tag: function(tag, callback) {
            git.exec(['tag', tag], callback);
        },

        push: function(branch, remote) {
            git.exec(['push', '--tags', remote, branch], callback);
        }

    };

    // If tag flag is not defined, use the current tag (found in package.json)
    if (!grunt.option('tag')) {
        grunt.option('tag', grunt.file.readJSON('package.json').version);
    }

    // -- Plugins --------------------------------------------------------------

    // Intelligently autoloads `grunt-*` plugins from the package dependencies.
    require('load-grunt-tasks')(grunt);

    // Adds better support for defining options.
    require('nopt-grunt')(grunt);

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
                    templateContext: {
                        version: grunt.option('tag')
                    },
                    markdownOptions: {
                        highlight: 'manual',
                        gfm: true
                    }
                }
            }
        },

        gitcommit: {
            publish: {
                options: {
                    message: 'Version bump to v' + grunt.option('tag')
                }
            }
        },

        gittag: {
            publish: {
                options: {
                    tag: grunt.option('tag')
                }
            }
        },

        gitpush: {
            publish: {
                options: {
                    remote: 'origin',
                    tags: true
                }
            }
        },

        'update-json': {
            'plugin': {
                file: 'tap.jquery.json',
                fields: {
                    version: grunt.option('tag')
                }
            },
            'package': {
                file:  'package.json',
                fields: {
                    version: grunt.option('tag')
                }
            }
        }

    });

    grunt.loadTasks('tasks');

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('cleanup', ['clean:markdown', 'clean:gh-pages']);

    grunt.registerTask('gh', ['cleanup', 'markdown:gh-pages', 'gh-pages', 'cleanup']);
    grunt.registerTask('publish', ['build', 'update-json', 'gitcommit:publish', 'gh', 'gittag:publish', 'gitpush:publish']);

};
