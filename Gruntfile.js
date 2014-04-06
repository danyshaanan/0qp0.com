'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    githooks: {
      all: {
        'pre-commit': 'jshint'
      }
    },
    jshint: {
      options: {
        globalstrict: true,
        // eqeqeq: true,
        forin: true,
        latedef: true,
        quotmark: 'single',
        undef: true,
        trailing: true,
        lastsemic: true
      },
      server: {
        src: ['server/**/*.js'],
        options: {
          node: true,
          globalstrict: true,
          unused: 'vars'
        }
      },
      client: {
        src: ['public/js/**/*.js', '!public/js/libs/**/*.js'],
        options: {
          jquery: true,
          globals: {
            window: false,
            io: false
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint'],
        options: {
          event: ['added', 'deleted','changed']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', ['githooks','jshint']);
};
