const UserSeriesList = require('../models/UserSeriesList');

exports.editList = (req, res) => {
    delete req.body._id;
    UserSeriesList.findOne({ _id: req.params.id})
    .then((userSeriesList) => {
        if(userSeriesList.creator_id !== req.auth.userId) return res.status(401).json({message: "Not authorized"});
        UserSeriesList.updateOne({ _id: req.params.id}, {...req.body})
            .then(() => { res.status(200).json({message: 'UserSeriesList edited.'})})
            .catch(error => res.status(401).json({ error }));
    })
};

exports.addToList = (req, res) => {
    // console.log(req.body)
    UserSeriesList.findOne({ creator_id: req.auth.userId })
    .then((userSeriesList) => {
    // console.log(userSeriesList)
        //map to check if the serie is already in the array of object using its id, if duplicate we stop and nothing happen
        let duplicate = null;
        userSeriesList?.series?.map(serie => {
            if(serie?.id === req.params.id) return duplicate = true;
        });
        if(duplicate) return;

        //add the serie to the array using the id and the category( watching/completed/planToWatch)
        const serieCategory = req.body?.formSelect;
        UserSeriesList.updateOne(
            { creator_id: req.auth.userId },
            { $addToSet: { 
                series: {
                    id : req.params.id, 
                    category : serieCategory
                    }
                } 
            }
        )
        .then((res) => { console.log(res)})
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(401).json({ error }));
};

exports.getUserList = (req, res) => {
    // console.log(req.auth.userId)
    UserSeriesList.findOne({ creator_id: req.auth.userId})
    .then(userSeriesList => res.status(200).json(userSeriesList))
    .catch(error => res.status(401).json({ error }));
};

exports.deleteFromList = (req, res) => {
    UserSeriesList.findOne({ _id: req.params.id})
        .then(userSeriesList => {
            if(userSeriesList.creator_id !== req.auth.userId) return res.status(401).json({message: "Not authorized"});
            UserSeriesList.deleteOne({ _id: req.params.id})
                .then(() => { res.status(200).json({message: 'userSeriesList deleted.'})})
                .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};