module.exports = function(grunt) {
    [
        'grunt-contrib-uglify',
        'grunt-contrib-watch',
        'grunt-concurrent',
        'grunt-nodemon',
        'grunt-shell'
    ].forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
