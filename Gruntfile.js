'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    dist: 'dist',

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
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          // '<%= dist %>': '<%= app %>/*.jade'
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
          src: ['**/*.html', '!**/*.sass', '!bower_components/**', '**/*.txt', 'js/*.js', '!js/app.js'],
          dest: '<%= dist %>/'
        } ]
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
  grunt.registerTask('default', ['compile-jade', 'compile-sass', 'bower-install', 'connect:app', 'watch']);
  grunt.registerTask('server-dist', ['connect:dist']);
  grunt.registerTask('publish', ['clean:dist', 'jade', 'sass', 'useminPrepare', 'copy:dist', 'imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);

};
