'use strict';

var assert = require('assert');
var path = require('path');
var Clean = require('../lib/clean');

function errorHandler(err){
    process.nextTick(function rethrow() { throw err; });
}

(new Clean).run(
    [ {path: path.join(__dirname, './fixtures/foo.js')} ], // inputs
    {}, // options
    console // logger
).then(function(inputs){
    assert.equal(inputs[0].path, path.join(__dirname, './fixtures/foo.js'));
}).catch(errorHandler);

(new Clean).run(
    ['./'], // inputs
    {}, // options
    console // logger
).then(function(inputs){
    throw new Error;
}, function(err){
    assert.throws(
        function() {
            throw err
        },
        /the current working directory/
    );
}).catch(errorHandler);

(new Clean).run(
    ['../'], // inputs
    {}, // options
    console // logger
).then(function(inputs){
    throw new Error;
}, function(err){
    assert.throws(
        function() {
            throw err
        },
        /outside/
    );
}).catch(errorHandler);
