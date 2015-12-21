module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
      jshint: {
        all: ['Gruntfile.js', 'app.js', 'public/js/*.js', 'test/specs/*.js']
      },
      karma: {
          unit: {
              configFile: 'test/karma.conf.js'
          }
      },
      mrdoc: {
        all: {
          src: 'src',
          target: 'docs',
          options: {
            title: 'Realtime Chat with RethinkDB',
            theme: 'cayman'
          }
        }
      },
      copy: {
        main: {
          src: ["app.js"],
          dest: 'src/app.js'
        },
        connect: {
          src: ["public/js/connect.js"],
          dest: 'src/connect.js'
        }
      }
    });
    
    // Load jshint plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // Load karma plugin
    grunt.loadNpmTasks('grunt-karma');
    
    // Load mrdoc plugin
    grunt.loadNpmTasks('grunt-mrdoc');
    
    // Load copy plugin
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    // Register jshint task
    grunt.registerTask('default', ['jshint']);
    
    // Register Test task
    grunt.registerTask('test', ['karma']);
    
    // Register Document Task
    grunt.registerTask('doc', ['copy', 'mrdoc']);
};