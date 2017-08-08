/// <binding ProjectOpened='all, watch' />
'use strict';

const lessFiles = {
    'wwwroot/css/site.css': 'Styles/site.less'
};

const webpackConfig = require("./webpack.config");

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            css: ["wwwroot/css/*"],
            js: ["wwwroot/js/*", "temp"]
        },

        uglify: {
            files: {
                expand: true,
                cwd: 'wwwroot/js',
                src: '**/*.js',  // source files mask
                dest: 'wwwroot/js/',    // destination folder
                ext: '.min.js',   // replace .js to .min.js
                extDot: 'last'
            }
        },

        less: {
            development: {
                files: lessFiles,
                sourceMap: true
            },
            production: {
                files: lessFiles
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    "wwwroot/css/site.min.css": ["wwwroot/css/site.css"]
                }
            }
        },

        ts: {
            default: {
                tsconfig: {
                    tsconfig: 'Scripts/tsconfig.json'
                }
            }
        },

        watch: {
            less: {
                files: ["Styles/*.less"],
                tasks: ["less"]
            },
            typescript: {
                files: ["Scripts/*.ts", "Scripts/*.tsx"],
                tasks: ["tsrecompile"]
            }
        },

        webpack: {
            options: {
            },
            prod: webpackConfig
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask("all", ['clean', 'webpack:prod', 'less:development', 'cssmin', 'uglify']);
    grunt.registerTask("tsrecompile", ['clean:js', 'webpack:prod', 'uglify']);
    grunt.registerTask("lessrecompile", ['clean:css', 'less:development', 'cssmin']);
};
