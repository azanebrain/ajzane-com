'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    dist: 'dist',
    tmp: '.tmp',

    sass: {
      options: {
        // includePaths: ['<%= app %>/bower_components/foundation/scss']
        bundleExec: true
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          '<%= dist %>/css/app.css': '<%= app %>/sass/app.sass'
        }
      }
    },

    concat: {},

    jade: {
      dist: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= app %>/views',
          src: '**/*.jade',
          ext: '.html',
          dest: '<%= dist %>/'
        }]
      }
    },

    clean: {
      dist: {
        src: ['<%= dist %>/*']
      },
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd:'<%= app %>/',
          src: ['js/*.js'],
          dest: '<%= dist %>/'
        }, {
          expand: true,
          cwd:'bower_components',
          src: ['**/*'],
          dest: '<%= dist %>/bower_components/'
        }]
      },
      publish: {
        files: [{
          expand: true,
          cwd:'<%= app %>/',
          src: ['js/*.js', '!js/app.js'],
          dest: '<%= dist %>/'
        }]
      },
    },

    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= app %>/images/',
          src: ['**/*.{jpg,gif,svg,jpeg,png,ico}'],
          dest: '<%= dist %>/img/'
        }]
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      }
    },

    useminPrepare: {
      html: ['<%= dist %>/index.html'],
      options: {
        dest: '<%= dist %>'
      }
    },

    usemin: {
      html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
      css: ['<%= dist %>/css/**/*.css'],
      options: {
        dirs: ['<%= dist %>']
      }
    },

    jadeUsemin: {
      publish: {
        options: {
          tasks: {
            js: ['concat', 'uglify'],
            css: ['concat', 'cssmin']
          }
        },
        files: [{
          src: '<%= app %>/includes/header.jade',
          dest: '<%= tmp %>/concat/includes/header.jade'
        }, {
          src: '<%= app %>/includes/footer.jade',
          dest: '<%= tmp %>/concat/includes/footer.jade'
        }]
      }
    },

    replace: {
      files: {
        src: ['<%= dist %>/**/*.html'],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: "#{replacementterm}",
          to: "replacementvalue"
        }]
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['sass', 'jade']
      },
      sass: {
        files: '<%= app %>/sass/**/*.sass',
        tasks: ['sass']
      },
      jade: {
        files: '<%= app %>/**/*.jade',
        tasks: ['jade']
      },
      livereload: {
        files: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**', '<%= dist %>/js/**/*.js', '<%= dist %>/css/**/*.css', '<%= dist %>/img/**/*.{jpg,gif,svg,jpeg,png,ico}'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      app: {
        options: {
          port: 9000,
          base: '<%= dist %>/',
          open: true,
          livereload: true,
          hostname: '127.0.0.1'
        }
      },
      dist: {
        options: {
          port: 9001,
          base: '<%= dist %>/',
          open: true,
          keepalive: true,
          livereload: false,
          hostname: '127.0.0.1'
        }
      }
    },

    wiredep: {
      target: {
        src: [
          '<%= app %>/**/*.jade'
        ],
        exclude: [
          // 'jquery-placeholder',
          // 'foundation'
        ]
      }
    }

  });

  // Grunt Tasks
  grunt.registerTask('compile-jade', ['jade']);
  grunt.registerTask('compile-sass', ['sass']);
  grunt.registerTask('bower-install', ['wiredep']);

  // Custom Tasks
  grunt.registerTask('default', ['clean:dist', 'copy:dist', 'jade:dist', 'sass:dist', 'jadeUsemin', 'replace', 'bower-install', 'connect:app', 'watch']);
  grunt.registerTask('server-dist', ['connect:dist']);
  grunt.registerTask('publish', ['clean:dist', 'copy:publish', 'jade', 'sass', 'useminPrepare', 'imagemin', 'concat', 'cssmin', 'replace', 'uglify', 'usemin']);

};
