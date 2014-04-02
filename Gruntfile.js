'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      server: {
        options: {
          globalstrict: true,
          globals: {
            require: false,
            module: false
          }
        },
        src: ['server/**/*.js']
      },
      client: {
        options: {
          globalstrict: true,
          globals: {
            window: false,
            $: false,
            io: false
          }
        },
        src: ['public/js/**/*.js', '!public/js/libs/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
