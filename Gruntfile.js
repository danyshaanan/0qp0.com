'use strict';

module.exports = function(grunt) {

  // Project configuration.
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
        src: ['*.js']
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
        src: ['public/js/clientClick.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
