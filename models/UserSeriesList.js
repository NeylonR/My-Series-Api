const mongoose = require('mongoose');

const userSeriesList = mongoose.Schema({
    creator_id: { type: String, required: true},
    series: { 
        type: [{ 
            id: String, 
            status: String,
            image_url: String,
            name: String
        }], 
        default: undefined,
        required: true
    },
});

module.exports = mongoose.model('UserSeriesList', userSeriesList);