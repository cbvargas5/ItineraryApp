const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const { Headers } = require('node-fetch')
const passport = require('passport')
require('dotenv').config()


const yelp_url = 'https://api.yelp.com/v3'

const options = {
    headers: new Headers({
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
    })
}

//////////////////////////////////////
/// returns array of event objects ///
//////////////////////////////////////
//exQuery: ?categories=music,film&limit=5&location=las%20vegas&is_free=true
router
    .route('/events', passport.authenticate('jwt', { session: false }))
    .get(passport.authenticate('jwt', { session: false }), async(req, res) => {
        console.log('query string->', req.query)
        await fetch(`${yelp_url}/events?${req._parsedUrl.query}`, options)
            .then((apiResponse) => apiResponse.json())
            .then((data) => res.status(200).send(data))
            .catch((err) => console.error(err))
    })



///////////////////////////////////////
/// returns data for specific event ///
///////////////////////////////////////
//exId: oakland-saucy-oakland-restaurant-pop-up
router
    .route('/events/:id')
    .get(passport.authenticate('jwt', { session: false }), async(req, res) => {
        await fetch(`${yelp_url}/events/${req.params.id}`, options)
            .then((apiResponse) => apiResponse.json())
            .then((data) => res.status(200).send(data))
            .catch((err) => console.error(err))
    })

/////////////////////////////////////////
/// returns array of business objects ///
/////////////////////////////////////////
//exQuery: ?categories=Restaurants%20&limit=5&location=las%20vegas&term=fun
router
    .route('/businesses/search')
    .get(passport.authenticate('jwt', { session: false }), async(req, res) => {
        await fetch(`${yelp_url}/businesses/search?${req._parsedUrl.query}`, options)
            .then((apiResponse) => apiResponse.json())
            .then((data) => res.status(200).send(data))
            .catch((err) => console.error(err))
    })

//////////////////////////////////////////
/// returns data for specific business ///
//////////////////////////////////////////
//exId: E8RJkjfdcwgtyoPMjQ_Olg
router
    .route('/businesses/:id')
    .get(passport.authenticate('jwt', { session: false }), async(req, res) => {
        await fetch(`${yelp_url}/businesses/${req.params.id}`, options)
            .then((apiResponse) => apiResponse.json())
            .then((data) => res.status(200).send(data))
            .catch((err) => console.error(err))
    })



module.exports = router