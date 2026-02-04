const Router=require('express').Router()
const authmiddleware = require('../middlewares/auth.middleware')
const{createVenue,getAllVenues,getVenueById,updateVenue,deleteVenue}=require('../controllers/venue.controller')

Router.post('/venues',authmiddleware,createVenue)


module.exports=Router

