var Execution = require('execution');
var rimraf = require("rimraf");
var path = require("path");

module.exports = Execution.extend({
    // The type of option could be HTML5 input types: file, directory, number, range, select,
    // url, email, tel, color, date, time, month, time, week, datetime(datetime-local),
    // string(text), boolean(checkbox), array, regexp, function and object.
    options: {
        force: {
            label: 'Force delete',
            default: false,
            type: 'boolean'
        },
        pipe: {
            lable: 'Pipe inputs',
            default: false,
            type: 'boolean'
        }
    },
    run: function (inputs, options, logger) {
        return this._run(inputs, options, logger);
    },
    execute: function (resolve, reject) {
        var options = this.options;
        var inputs = this.inputs;
        var logger = this.logger;

        var cwd = process.cwd();
        var force = options.force;
        var pipe = options.pipe;

        inputs.forEach(function(input){
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
            rimraf.sync(filepath);
        });

        resolve(pipe? inputs: []);
    }
})
