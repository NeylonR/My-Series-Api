const UserSeriesList = require('../models/UserSeriesList');

exports.editList = (req, res) => {
    delete req.body._id;
    const titleLength = req.body.title.length;
    if(titleLength < 4 || titleLength > 40) return res.status(400).json({message: 'Title has to contains between 4 and 40 characters.'})
    UserSeriesList.findOne({ _id: req.params.id})
    .then((userSeriesList) => {
        if(userSeriesList.creator_id !== req.auth.userId) return res.status(401).json({message: "Not authorized"});
        UserSeriesList.updateOne({ _id: req.params.id}, {...req.body})
            .then(() => { res.status(200).json({message: 'UserSeriesList edited.'})})
            .catch(error => res.status(401).json({ error }));
    })
};

exports.addToList = (req, res) => {
    console.log(req.body)
    UserSeriesList.findOne({ creator_id: req.auth.userId })
    .then((userSeriesList) => {
        const serieOption = req.body?.formSelect;
        UserSeriesList.updateOne(
            { creator_id: req.auth.userId },
            { $addToSet: { 
                [serieOption]:  req.params.id
                } 
            }
        )
        .then((res) => { console.log(res)})
        .catch(error => res.status(401).json({ error }));
        // console.log(userSeriesList)
    })
    .catch(error => res.status(401).json({ error }));
};

exports.getUserList = (req, res) => {
    // console.log(req.auth.userId)
    UserSeriesList.findOne({ creator_id: req.auth.userId})
    .then(userSeriesList => res.status(200).json(userSeriesList))
    .catch(error => res.status(401).json({ error }));
};
//res.status(200).json(userSeriesLists)

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