module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochacli: {
      options: {

      },
      all: ['test/**/*.js']
    },
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*.js'
        }
      },
      istanbul_check_coverage: {
        default: {
          options: {
            coverageFolder: 'coverage*',
            check: {
              lines: 80,
              statements: 80
            }
          }
        }
      }
    },
  });

  grunt.event.on('coverage', function(lcovFileContents, done){
      // Check below on the section "The coverage event"
      done()
  })

  grunt.loadNpmTasks('grunt-mocha-istanbul')
  grunt.loadNpmTasks("grunt-mocha-cli")
  grunt.registerTask("test", ["mochacli"])
  grunt.registerTask("default", ["test"])
  grunt.registerTask('coverage', ['mocha_istanbul:coverage'])

};
