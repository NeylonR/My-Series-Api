const mongoose = require('mongoose');

const userSeriesList = mongoose.Schema({
    creator_id: { type: String, required: true},
    watching: { 
        type: [ String ], 
        default: undefined,
        required: true
    },
    completed: { 
        type: [ String ], 
        default: undefined,
        required: true
    },
    planToWatch: { 
        type: [ String ], 
        default: undefined,
        required: true
    },
});

module.exports = mongoose.model('UserSeriesList', userSeriesList);