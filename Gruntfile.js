/**
 * Grunt Buildfile for Cascading Tree Sheets UI
 * To be used with GruntJS <http://gruntjs.com/>
 */

sourcelist = [
  "src/fragments/prefix.js",
  "src/utilities.js",
  "src/tray.js",
  "src/picker.js",
  "src/clipboard.js",
  "src/theminator.js",
  "src/theme.js",
  "src/saveDialog.js",
  "src/fragments/postfix.js",  
  "src/fragments/autoloader.js"
];

var devSourceList = sourcelist.slice(0);
var prodSourceList = sourcelist.slice(0);

devSourceList.unshift('src/fragments/development/constants.js');
prodSourceList.unshift('src/fragments/production/constants.js');

devSourceList.unshift('<banner>');
prodSourceList.unshift('<banner>');

devSourceOut = 'release/cts-ui.dev.js';
prodSourceOut = 'release/cts-ui.js';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-web-server');

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      banner: "/**\n" +
              "* <%= pkg.name %>\n" +
              " * <%= pkg.description %>\n" +
              " *\n" +
              " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
              " * @copyright <%= pkg.author.name %> <%= grunt.template.today('yyyy') %>\n" +
              " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
              " * @link <%= pkg.homepage %>\n" +
              " * @module <%= pkg.name %>\n" +
              " * @version <%= pkg.version %>\n" +
              " */"
    },
    concat: {
      dev: {
        src : devSourceList,
        dest : devSourceOut
      },
      prod: {
        src : prodSourceList,
        dest : prodSourceOut
      }
    },
    web_server: {
      whyisthisnecessary: 'idontknow',
      options: {
        cors: true,
        port: 8000,
        logRequests: true,
        nevercache: true
      }
    },
    lint: {
      all: ['grunt.js', 'src/**/*.js']
    },
    min: {
      "release/cts-ui.min.js": ["<banner>", "release/cts-ui.js"]
    },
    watch: {
      scripts: {
        files: "<config:lint.files>",
        tasks: "default"
      }
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'concat']);
};

