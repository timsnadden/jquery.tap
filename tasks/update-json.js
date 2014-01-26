module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('update-json', 'Update a JSON file with new data', function() {
        var data = this.data;
        var json = grunt.file.readJSON(data.file);

        Object.keys(data.fields).forEach(function(key) {
            var value = data.fields[key];
            if (json.hasOwnProperty(key)) {
                json[key] = value;
            }
        });

        grunt.file.write(data.file, JSON.stringify(json, null, 4));
        grunt.log.success('File ' + data.file + ' updated.');
    });

};
