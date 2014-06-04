var Execution = require('execution');
var path = require("path");

module.exports = Execution.extend({
    // The type of option could be HTML5 input types: file, directory, number, range, select,
    // url, email, tel, color, date, time, month, time, week, datetime(datetime-local),
    // string(text), boolean(checkbox), array, regexp, function and object.
    options: {
        force: {
            label: 'Delete CWD or outside',
            default: false,
            type: 'boolean'
        }
    },
    run: function (inputs, options, logger, settings) {
        return this._run(inputs, options, logger, settings);
    },
    execute: function (resolve, reject) {
        var options = this.options;
        var inputs = this.inputs;
        var logger = this.logger;

        var rimraf = require("rimraf");
        var cwd = process.cwd();
        var force = options.force;

        inputs.forEach(function(input){
            // Could be records or paths
            var filepath = input.path || input;

            if(!force){
                var relative = path.relative(cwd, filepath);
                if(relative.substr(0, 2) === '..'){
                    throw new Error('Cannot delete "'+ filepath +'" outside the current working directory.');
                }else if(relative === ''){
                    throw new Error('Cannot delete "'+ filepath +'" the current working directory.')
                }
            }
            logger.log('Cleaning', filepath);
            var res = rimraf.sync(filepath);
            console.log(res)
        });

        resolve(inputs);
    }
})
