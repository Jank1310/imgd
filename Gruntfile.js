'use strict';

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,
      dist: {
        cache: false
      }
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        port: 3000,
        webpack: webpackDevConfig,
        publicPath: '/assets/',
        contentBase: './<%= pkg.src %>/',
        proxy: { '/api/*': 'http://localhost:8080' }
      },

      start: {
        keepAlive: true
      }
    },

    nodemon: {
      dev: {
         script: 'main.js',
         options: {
           watch: ['main.js', 'src/modules/'],
           env: {'DEBUG': 'express:*'}
         }
      }
    },

    open: {
      options: {
        delay: 1000
      },
      dev: {
        path: 'http://localhost:3000/webpack-dev-server/'
      },
      dist: {
        path: 'http://localhost:8080/'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.src %>/*'],
            dest: '<%= pkg.dist %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.src %>/images/*'],
            dest: '<%= pkg.dist %>/images/'
          }
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.dist %>'
          ]
        }]
      }
    },

    concurrent: {
       dev: {
         tasks: ['webpack-dev-server', 'nodemon:dev'],
         options: {
                logConcurrentOutput: true
            }
       }
   }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:dist', 'nodemon:dev']);
    }

    grunt.task.run(['open:dev', 'concurrent:dev']);
  });

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('build', ['clean', 'copy', 'webpack']);

  grunt.registerTask('default', []);
};
