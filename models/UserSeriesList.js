const mongoose = require('mongoose');

const userSeriesList = mongoose.Schema({
    creator_id: { type: String, required: true},
    watched: { 
        type: [{ id: String }], 
        default: undefined,
        required: true
    },
    planned: { 
        type: [{ id: String }], 
        default: undefined,
        required: true
    },
});

module.exports = mongoose.model('Todolist', userSeriesList);