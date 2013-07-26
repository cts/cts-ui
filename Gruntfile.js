/**
 * Grunt Buildfile for Cascading Tree Sheets UI
 * To be used with GruntJS <http://gruntjs.com/>
 */
module.exports = function(grunt) {
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
      dist : {
        src : [
          "<banner>",
          "src/fragments/prefix.js",
          "src/util/util.js",
          "src/tray.js",
          "src/picker.js",
          "src/clipboard.js",
          "src/theminator.js",
          "src/util/util.js",
          "src/fragments/postfix.js"
        ],
        dest : "release/ctsui.js"
      }
    },
    lint: {
      all: ['grunt.js', 'src/**/*.js']
    },
    min: {
      "release/ctsui.min.js": ["<banner>", "release/ctsui.js"]
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', [
    'jshint',
    'concat']);
};

