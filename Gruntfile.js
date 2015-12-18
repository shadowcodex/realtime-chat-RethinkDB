module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
      jshint: {
        all: ['Gruntfile.js', 'app.js', 'public/js/*.js']
      }
    });
    
    // Load jshint plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // Register jshint task
    grunt.registerTask('default', ['jshint']);
};