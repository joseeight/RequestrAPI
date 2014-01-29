module.exports = function(grunt) {

    [
        'grunt-contrib-uglify',
        'grunt-contrib-watch',
        'grunt-concurrent',
        'grunt-nodemon',
        'grunt-shell'
    ].forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // restart the server whenever something changes
        // @TODO restart when something relevant changes
        nodemon: {
            dev: {
                script: 'app.js',
                delayTime: 3, // allow "watch" task to build
                watchedFolders: ['src', 'js'],
                watchedExtensions: ['js', 'html']
            }
        }
    });

    grunt.registerTask('default', ['nodemon']);

};
