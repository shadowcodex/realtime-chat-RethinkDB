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
      }
    });
    
    // Load jshint plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // Load karma plugin
    grunt.loadNpmTasks('grunt-karma');
    
    // Load nodemon plugin
    grunt.loadNpmTasks('grunt-nodemon');
    
    // Register jshint task
    grunt.registerTask('default', ['jshint']);
    
    // Register Test task
    grunt.registerTask('test', ['karma']);
};