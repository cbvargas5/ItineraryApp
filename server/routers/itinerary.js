const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary.js');
const passport = require('passport')

//Input validators
const validateItineraryInput = require('../validation/itinerary.js');
const validateEventInput = require('../validation/event.js');

router.get("/test", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send("test itinerary route");
});


//@route   GET itinerary/public/:itin_id
//@desc    Gets an Itinerary's events by id for public viewing
//@access  public
router.get("/public/:itin_id", (req, res) => {


    Itinerary.findById(req.params.itin_id, 'events name').then(result => {
        res.status(200).send(result);
    })
        .catch(err => res.status(404).send({ notfound: "No Itinerary was found" }));
    // Itinerary.findById(req.params.itin_id)
    //     .then(result => {
    //         console.log(req.user.id, result.user)
    //         if (req.user.id === result.user.toString() || result.collaborators.includes(req.user.email)) {
    //             console.log(result.user)
    //             res.status(200).send(result)
    //         } else {
    //             res.status(400).send({ error: "not authorized to access this itinerary" })
    //         }
    //     })
    //     .catch(err => res.status(404).json({ notfound: "No Itinerary was found" }));
});


//@route   GET itinerary/
//@desc    Gets a users list of Itinerarys by their userID
//@access  Private
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Itinerary.find({ user: req.user.id })
        .populate("user", ["name"])
        .then(result => res.status(200).send(result))
        .catch(err => res.status(404).send({ notfound: "No Itineraries were found" }));
});

//@route   GET itinerary/invited
//@desc    Gets a users list of Itinerarys that they are invited to
//@access  Private
router.get("/invited", passport.authenticate('jwt', { session: false }), (req, res) => {
    Itinerary.find({ collaborators: { $regex: new RegExp(req.user.email, 'i') } })
        .populate("user", ["name"])
        .then(result => res.status(200).send(result))
        .catch(err => res.status(404).send({ notfound: "No Itineraries were found" }));
});


//@route   GET itinerary/:itin_id
//@desc    Gets an Itinerary by its id
//@access  Private
router.get("/:itin_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    //console.log(req.params.itin_id);
    // db.find().or([{ collections: { $regex: new RegExp(keyword, 'i') } }, { type: { $regex: new RegExp(keyword, 'i') }}])
    Itinerary.findById(req.params.itin_id)
        .then(result => {
            console.log(req.user.id, result.user)
            if (req.user.id === result.user.toString() || result.collaborators.includes(req.user.email)) {
                console.log(result.user)
                res.status(200).send(result)
            } else {
                res.status(400).send({ error: "not authorized to access this itinerary" })
            }
        })
        .catch(err => res.status(404).send({ notfound: "No Itinerary was found" }));
});



//@route   POST itinerary/
//@desc    Creates a new itinerary
//@access  Private
router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    let { errors, isValid } = validateItineraryInput(req.body);

    let newItin = req.body;
    newItin.user = req.user.id;

    if (!isValid) {
        res.status(400).send(errors);
    } else {
        Itinerary.create(newItin).then(result => {
            res.status(200).send(result);
        })
            .catch(err => res.status(400).send(err));
    }
});

//@route   POST itinerary/:id
//@desc    Updates an existing itinerary by its id
//@access  Private
router.post("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    // let { errors, isValid } = validateItineraryInput(req.body);

    if (!isValid) {
        res.status(400).send(errors);
    } else {
        Itinerary.update({ user: req.user.id, _id: req.params.id }, req.body).then(result => {
            res.status(200).send(result);
        })
            .catch(err => res.status(400).send(err));
    }
});

//@route   DELETE itinerary/:id
//@desc    Deletes an itinerary by its ID
//@access  Private
router.delete("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Itinerary.findOneAndDelete({ _id: req.params.id, user: req.user.id }).then(result => {
        res.status(200).send(result);
    })
        .catch(err => {
            res.status(400).send(err);
        })
});

//@route   POST itinerary/event
//@desc    Creates a new event in an itinerary
//@access  Private
router.post("/event/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    //let { errors, isValid } = validateEventInput(req.body);

    //if (!isValid) {
    //    res.status(400).send(errors);
    //} else {
    const newEvent = {
        title: req.body.title,
        location: req.body.location,
        image: req.body.image,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        notes: req.body.notes,
        date: req.body.date
    }

    Itinerary.findOneAndUpdate({ $or: [{ user: req.user.id, _id: req.params.id }, { _id: req.params.id, collaborators: { $regex: new RegExp(req.user.email, 'i') } }] }, { $push: { events: newEvent } }, { new: true })
        //Itinerary.update({ user: req.user.id, _id: req.params.id }, { $push: { events: newEvent } })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
    //}
});

//@route   DELETE itinerary/event/:id/:event_id
//@desc    Deletes an event in an itinerary by its ID
//@access  Private
router.delete("/event/:id/:event_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Itinerary.findOneAndUpdate({ $or: [{ user: req.user.id, _id: req.params.id }, { _id: req.params.id, collaborators: { $regex: new RegExp(req.user.email, 'i') } }] }, { $pull: { events: { _id: req.params.event_id } } }, { new: true })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});



//@route   POST itinerary/vote/:itin_id/:event_id
//@desc    creates a new vote in an event in an itinerary
//@access  Private
router.post("/vote/:itin_id/:event_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Itinerary.findOne({ $or: [{ user: req.user.id, _id: req.params.itin_id }, { _id: req.params.itin_id, collaborators: { $regex: new RegExp(req.user.email, 'i') } }] })
    
        .then(result => {
            let newVote = {
                user: req.user.id,
                vote: req.body.vote
            }

            let eventIndex = result.events.findIndex(event => event._id.toString() === req.params.event_id.toString());
            //console.log()
            if (eventIndex !== -1) {
                if (result.events[eventIndex].votes.filter(vote => vote.user.toString() === req.user.id && vote.vote === newVote.vote).length > 0) {
                    res.status(400).send({ alreadyvoted: `User already voted ${newVote.vote} on this post` });
                } else {
                    //Add vote to the votes array   
                    result.events[eventIndex].votes.unshift(newVote);
                    result.save().then(itin => res.send(itin));
                }
            } else {
                res.status(400).send({error: "event not found"})
            }

        })
        .catch(err => res.status(400).send(err));

});



//@route   DELETE itinerary/vote/:itin_id/:event_id
//@desc    deletes a vote in an event in an itinerary
//@access  Private
router.delete("/vote/:itin_id/:event_id", passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Itinerary.findOne({ $or: [{ user: req.user.id, _id: req.params.itin_id }, { _id: req.params.itin_id, collaborators: { $regex: new RegExp(req.user.email, 'i') } }] })
    
        .then(result => {
            let voteType = req.body.vote;

            let eventIndex = result.events.findIndex(event => event._id.toString() === req.params.event_id.toString());
            //console.log()
            if (eventIndex !== -1) {

                let removeIndex = result.events[eventIndex].votes.findIndex(vote => vote.user.toString() === req.user.id && vote.vote === voteType)

                if (removeIndex !== -1) {

                    //Add vote to the votes array   
                    result.events[eventIndex].votes.splice(removeIndex, 1);
                    result.save().then(itin => res.send(itin));        
                } else {
                    res.status(400).send({ alreadyvoted: `User has not voted ${newVote.vote} on this post` });
                }
            } else {
                res.status(400).send({error: "event not found"})
            }

        })
        .catch(err => res.status(400).send(err));

});



module.exports = router;