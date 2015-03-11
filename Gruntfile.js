'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Configurable variables
  var config = {
    responsiveImageQuality: 60
  };

  grunt.initConfig({

    // Clean up generated files
    // ------------------------------------------------
    clean: {
      main: [
        '*.{ico,png}',
        '.sass-cache',
        '.tmp',
        'css',
        'fonts',
        'images',
        'javascript',
        'templates'
      ]
    },

    // Build tasks which can be run concurrently
    // ------------------------------------------------
    concurrent: {
      serve: [
        'compass:serve',
        'copy:serve',
        'copy:templates',
        'responsive_images'
      ],
      dist: [
        'compass:dist',
        'copy:dist',
        'imagemin:dist',
        'responsive_images',
        'svgmin:dist'
      ]
    },

    // Responsive Images
    // ------------------------------------------------
    responsive_images: {
      options: {
        sizes: [{
          name: 'xs',
          width: 768,
          quality: config.responsiveImageQuality
        }, {
          name: 'xs',
          width: 768 * 2,
          suffix: '@2x',
          quality: config.responsiveImageQuality
        }, {
          name: 'sm',
          width: 992,
          quality: config.responsiveImageQuality
        },{
          name: 'sm',
          width: 992 * 2,
          suffix: '@2x',
          quality: config.responsiveImageQuality
        }, {
          name: 'md',
          width: 1200,
          quality: config.responsiveImageQuality
        }, {
          name: 'md',
          width: 1200 * 2,
          suffix: '@2x',
          quality: config.responsiveImageQuality
        }, {
          name: 'lg',
          width: 2048,
          quality: config.responsiveImageQuality
        }, {
          name: 'lg',
          width: 2048 * 2,
          suffix: '@2x',
          quality: config.responsiveImageQuality
        }]
      },
      carousel: {
        files: [{
          expand: true,
          src: ['*.{jpg,gif,png}'],
          cwd: 'src/images/rwd/',
          dest: 'images/rwd'
        }]
      }
    },

    // Compass
    // ------------------------------------------------
    compass: {
      options: {
        sassDir: 'src/sass',
        importPath: 'bower_components'
      },
      serve: {
        options: {
          cssDir: 'css'
        }
      },
      dist: {
        options: {
          cssDir: '.tmp/css'
        }
      }
    },

    // Copy files
    // ------------------------------------------------
    copy: {
      templates: {
        files: [
          {
            expand: true,
            cwd: 'src/templates/',
            src: ['**'],
            dest: 'templates'
          }
        ]
      },
      serve: {
        files: [
          {
            expand: true,
            cwd: 'src/images/',
            src: ['**'],
            dest: 'images'
          },
          {
            expand: true,
            cwd: 'src/javascript/',
            src: ['**'],
            dest: 'javascript'
          },
          {
            expand: true,
            dot: true,
            cwd: 'src',
            dest: '',
            src: ['*.{txt}']
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/templates/',
            src: ['**'],
            dest: 'templates'
          },
          {
            expand: true,
            dot: true,
            cwd: 'src',
            dest: '',
            src: ['*.{txt}']
          },
          {
            expand: true,
            cwd: 'bower_components/font-awesome/fonts',
            src: '*.*',
            dest: 'fonts'
          }
        ]
      }
    },

    // Optimise images
    // ------------------------------------------------
    imagemin: {
      dist: {
        options: {
          cache: false
        },
        files: [
          {
            expand: true,
            cwd: 'src/images',
            src: '**/*.{gif,jpeg,jpg,png}',
            dest: 'images'
          }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/images',
            src: '**/*.svg',
            dest: 'images'
          }
        ]
      }
    },

    // Convert any base urls to use the theme dir
    // ------------------------------------------------
    replace: {
      serve: {
        options: {
          patterns: [
            {
              match: '/{themedir}/g',
              replacement: '$ThemeDir/',
              expression: true
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['templates/**/*.ss'],
            dest: ''
          }
        ]
      },
      dist: {
        options: {
          patterns: [
            {
              match: '/{themedir}/g',
              replacement: '',
              expression: true
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['templates/**/*.ss'],
            dest: ''
          }
        ]
      },
      preMin: {
        options: {
          patterns: [
            {
              match: '/href="css//g',
              replacement: 'href="../css/',
              expression: true
            },
            {
              match: '/src="images//g',
              replacement: 'src="../images/',
              expression: true
            },
            {
              match: '/src="javascript//g',
              replacement: 'src="../javascript/',
              expression: true
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['templates/**/*.ss'],
            dest: ''
          }
        ]
      },
      postMin: {
        options: {
          patterns: [
            {
              match: '/href="../css//g',
              replacement: 'href="$ThemeDir/css/',
              expression: true
            },
            {
              match: '/src="../images//g',
              replacement: 'src="$ThemeDir/images/',
              expression: true
            },
            {
              match: '/src="../javascript//g',
              replacement: 'src="$ThemeDir/javascript/',
              expression: true
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['templates/**/*.ss'],
            dest: ''
          }
        ]
      }
    },

    // Parse the templates for usemin tasks
    // ------------------------------------------------
    useminPrepare: {
      options: {
        dest: './'
      },
      html: 'templates/**/*.ss'
    },

    // Apply vendor prefixes to css
    // ------------------------------------------------
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css',
          src: '**/*.css',
          dest: '.tmp/css'
        }]
      }
    },

    // Minify the editor css
    cssmin: {
      dist: {
        expand: true,
        cwd: '.tmp/css',
        src: ['editor.css'],
        dest: 'css'
      }
    },

    // Renames files for browser caching purposes
    // ------------------------------------------------
    rev: {
      dist: {
        files: {
          src: [
            'css/**/*.css',
            'images/**/*.{gif,jpeg,jpg,png,svg}',
            'javascript/**/*.js',
            '!css/editor.css'
          ]
        }
      }
    },

    // Update references to minified files
    // ------------------------------------------------
    usemin: {
      html: ['templates/**/*.ss'],
      css: ['css/**/*.css'],
      options: {
        assetsDirs: [
          'css',
          'fonts',
          'images',
          'javascript'
        ]
      }
    },

    // Watch for changes
    // ------------------------------------------------
    watch: {
      compass: {
        files: ['src/sass/{,*}/*.{scss,sass}'],
        tasks: ['compass:serve'],
        options: {
          livereload: true
        }
      },
      serve: {
        files: ['src/images/**', 'src/javascript/**'],
        tasks: ['newer:copy:serve']
      },
      templates: {
        files: ['src/templates/**'],
        tasks: ['newer:copy:templates', 'newer:replace:serve'],
        options: {
          livereload: true
        }
      },
      livereload: {
        files: ['src/images/**'],
        tasks: [],
        options: {
          livereload: true
        }
      }
    }
  });

  // Watch Task
  // ------------------------------------------------------------------------
  grunt.registerTask('serve', [
    'clean',
    'concurrent:serve',
    'replace:serve',
    'watch'
  ]);

  // Build Task
  //
  // We have to run usemin twice as the paths to the revisioned css and js
  // are in the wrong place.
  // The first time concatenates any files, the second replaces with the rev.
  // ------------------------------------------------------------------------
  grunt.registerTask('build', [
    'clean',
    'concurrent:dist',
    'replace:dist',
    'useminPrepare',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'replace:preMin',
    'usemin',
    'replace:postMin'
  ]);

  // Default Task
  // ------------------------------------------------------------------------
  grunt.registerTask('default', [
    'serve'
  ]);
};
