/**
 * Grunt Buildfile for Cascading Tree Sheets UI
 * To be used with GruntJS <http://gruntjs.com/>
 */

sourcelist = [
  "src/fragments/prefix.js",
  "src/utilities.js",
  "src/lib/alertify.js",
  "src/lib/jquery.fileDownload.js",
  "src/switchboard.js",
  "src/tray.js",
  "src/card.js",
  "src/picker.js",
  "src/modal.js",
  "src/clipboard.js",
  "src/theminator.js",
  "src/editor.js",
  "src/theme.js",
  "src/saveDialog.js",
  "src/fragments/postfix.js",  
  "src/fragments/autoloader.js"
];

var johnSourceList = sourcelist.slice(0);
var devSourceList = sourcelist.slice(0);
var prodSourceList = sourcelist.slice(0);

johnSourceList.unshift('src/fragments/john/constants.js');
devSourceList.unshift('src/fragments/development/constants.js');
prodSourceList.unshift('src/fragments/production/constants.js');

johnSourceList.unshift('<banner>');
devSourceList.unshift('<banner>');
prodSourceList.unshift('<banner>');

johnSourceOut = 'release/cts-ui.john.js';
devSourceOut = 'release/cts-ui.dev.js';
prodSourceOut = 'release/cts-ui.js';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-web-server');
  grunt.loadNpmTasks('grunt-contrib-less');

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
      },
      john: {
        src : johnSourceList,
        dest : johnSourceOut
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
      },
      less: {
        files: "mockups/less/*",
        tasks: ["less"]
      }
    },
    jshint: {
      options: {
        browser: true
      }
    },
    less: {
      development: {
        options: {
          paths: ["mockups/css"]
        },
        files: {
          "mockups/css/theminator.css": "mockups/less/theminator.less",
          "mockups/css/tray.css": "mockups/less/tray.less",
          "mockups/css/editor.css": "mockups/less/editor.less"
        }
      },
      production: {
        options: {
          paths: ["mockups/css"],
          yuicompress: true
        },
        files: {
          "mockups/css/theminator.css": "mockups/less/theminator.less",
          "mockups/css/tray.css": "mockups/less/tray.less",
          "mockups/css/editor.css": "mockups/less/editor.less"
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint',
    'concat',
    'less:production'
  ]);
};

