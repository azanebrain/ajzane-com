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
        // includePaths: ['bower_components/foundation/scss'],
        indentedSyntax: true
      },
      dist: {
        options: {
          outputStyle: 'extended',
          sourceMap: true
        },
        files: {
          '<%= dist %>/css/app.css': '<%= app %>/sass/app.sass'
        }
      },
      publish: {
        options: {
          outputStyle: 'compressed',
          sourceMap: false
        },
        files: {
          '<%= dist %>/css/app.css': '<%= app %>/sass/app.sass'
        }
      }
    },

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
      },
      publish: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= tmp %>/concat/views',
          src: '**/*.jade',
          ext: '.html',
          dest: '<%= dist %>/'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= dist %>/js/**/*.js'
      ]
    },

    clean: {
      dist: {
        src: ['<%= dist %>/*']
      },
      tmp: {
        src: ['<%= tmp %>/*']
      },
    },
    copy: {
      views: { // Copy the views to the temp directory
        files: [{
          expand: true,
          cwd:'<%= app %>/views',
          src: '**/*.jade',
          dest: '<%= tmp %>/concat/views/'
        }]
      },
      tmp: { //Copy all of the jade files to the temp directory
        files: [{ 
          expand: true,
          cwd:'<%= app %>/includes',
          src: '**/*.jade',
          dest: '<%= tmp %>/concat/includes/'
        }, {
          expand: true,
          cwd:'<%= app %>/js',
          src: ['**/*.js', '!app.js'],
          dest: '<%= tmp %>/js/'
        }, {
          expand: true,
          cwd:'<%= app %>/fonts',
          src: '**/*',
          dest: '<%= tmp %>/fonts/'
        }, {
          expand: true,
          cwd:'bower_components/font-awesome/fonts',
          src: ['**/*'],
          dest: '<%= tmp %>/fonts/'
        }]
      },
      publish: { //Copy the assets from temp to the distribution directory
        files: [{
          expand: true,
          cwd:'<%= tmp %>/js',
          src: ['**/*', '!*.map'],
          dest: '<%= dist %>/js/'
        }, {
          expand: true,
          cwd:'<%= tmp %>/css',
          src: ['**/*.min.css', '!*.map'],
          dest: '<%= dist %>/css/'
        }, {
          expand: true,
          cwd:'<%= tmp %>/fonts',
          src: '**/*',
          dest: '<%= dist %>/fonts/'
        }]
      },
      dist: { //Copy the assets to the dist directory to work in development
        files: [{
          expand: true,
          cwd:'<%= app %>/',
          src: ['fonts/**', '**/*.html', '!**/*.scss', '!**/*.jade', '**/*.txt', 'js/*.js'],
          dest: '<%= dist %>/'
        }, {
          expand: true,
          cwd:'bower_components/',
          src: ['**'],
          dest: '<%= dist %>/bower_components/',
          filter: 'isFile'
        }, {
          expand: true,
          flatten: true,
          src: ['bower_components/font-awesome/fonts/**'],
          dest: '<%= dist %>/fonts/',
          filter: 'isFile'
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

    replace: {
      build: {
        src: ['<%= dist %>/**/*.html'],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: "#{replacementterm}",
          to: "replacementvalue"
        }, {
          from: ".tmp/",
          to: ""
        }]
      },
      watch: {
        src: ['<%= dist %>/**/*.html'],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: "#{replacementterm}",
          to: "replacementvalue"
        }, {
          from: ".tmp/",
          to: ""
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
      // html: ['<%= app %>/includes/header.jade'], broken
      options: {
        dest: '<%= dist %>'
      }
    },

    usemin: {
      // html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
      html: ['<%= dist %>/**/*.html'],
      css: ['<%= dist %>/css/**/*.css'],
      // css: ['<%= dist %>/css/**/*.css', '.tmp/concat/css/libraries.min.css'],
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

    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['sass:dist', 'jade:dist', 'imagemin', 'copy:dist']
      },
      sass: {
        files: ['<%= app %>/sass/**/*.scss', '<%= app %>/sass/**/*.sass'],
        tasks: ['sass']
      },
      jade: {
        files: ['<%= app %>/views/**/*.jade', '<%= app %>/includes/**/*.jade'],
        tasks: ['jade:dist', 'replace:watch']
      },
      js: {
        files: '<%= app %>/js/**/*.js',
        tasks: ['copy:dist', 'replace:watch']
      },
      livereload: {
        files: '<%= dist %>/**/*',
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
          'modernizr',
          'font-awesome',
          'foundation'
        ]
      }
    }

  });

  // Grunt Tasks
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.registerTask('bower-install', ['wiredep']);
  grunt.registerTask('replace-text', ['replace:watch']);

  // Custom Tasks
  grunt.registerTask('default', ['clean:dist', 'sass:dist', 'copy:dist', 'jade:dist', 'imagemin', 'replace:watch', 'bower-install', 'connect:app', 'watch']);
  grunt.registerTask('validate-js', ['jshint']);
  grunt.registerTask('server-dist', ['connect:dist']);
  // skip JS tests  'validate-js',
  grunt.registerTask('publish', ['clean:dist', 'clean:tmp', 'sass:publish', 'copy:tmp', 'copy:views', 'jadeUsemin:publish', 'jade:publish', 'copy:publish', 'newer:imagemin', 'concat', 'cssmin', 'replace:build', 'uglify', 'usemin']);

};
