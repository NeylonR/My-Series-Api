const UserSeriesList = require('../models/UserSeriesList');

exports.editList = (req, res) => {
    UserSeriesList.findOne({ creator_id: req.auth.userId })
    .then((userSeriesList) => {
        if(userSeriesList.creator_id !== req.auth.userId) return res.status(401).json({message: "Not authorized"});
        const serieStatus = req.body?.formSelect;
        UserSeriesList.updateOne(
            { creator_id: req.auth.userId, "series.id": req.params.id },
            { $set: { 
                "series.$.status": serieStatus
                } 
            }
        )
        .then(() => {
            // we send the updated list as the response
            UserSeriesList.findOne({ creator_id: req.auth.userId})
                .then(userSeriesList => res.status(200).json(userSeriesList))
                .catch(error => res.status(401).json({ error }));
            })
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(401).json({ error }));
};

exports.addToList = (req, res) => {
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
        const serieStatus = req.body?.formSelect;
        const serieImageUrl = req.body?.image_url;
        const serieName = req.body?.name;
        UserSeriesList.updateOne(
            { creator_id: req.auth.userId },
            { $addToSet: { 
                series: {
                    id : req.params.id, 
                    status : serieStatus,
                    image_url: serieImageUrl,
                    name: serieName,
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
    UserSeriesList.findOne({ creator_id: req.auth.userId})
    .then(userSeriesList => res.status(200).json(userSeriesList))
    .catch(error => res.status(401).json({ error }));
};

exports.deleteFromList = (req, res) => {
    UserSeriesList.findOne({ creator_id: req.auth.userId })
        .then(userSeriesList => {
            if(userSeriesList.creator_id !== req.auth.userId) return res.status(401).json({message: "Not authorized"});
            // if user is the creator > remove the serie from the array that match the id and _id
            UserSeriesList.updateOne(
                { creator_id: req.auth.userId },
                { $pull: {
                    series: {
                        id: req.params.id,
                        _id: req.body.serie_Id
                    }
                }}
            )
            .then(() => {
                // we send the updated list as the response
                UserSeriesList.findOne({ creator_id: req.auth.userId})
                    .then(userSeriesList => res.status(200).json(userSeriesList))
                    .catch(error => res.status(401).json({ error }));
                })
            .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
};