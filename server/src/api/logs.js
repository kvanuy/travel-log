// a router w multiple routes for interacting with our log entry doc
const { Router } = require('express');

const router = Router();

require('dotenv').config();


const mongoose = require("mongoose");



const logEntry = require('../module/LogEntry');

const blogentry = logEntry.default;

// get all entries
router.get('/', async (req, res, next) => {
  try
  {const entries = await blogentry.find();  
  res.json( entries );
} catch (error){
  next(error);
}
});

router.post('/', async (req, res, next) =>{
    try{
        const LogEntry = new blogentry(req.body);
        const createdEntry  = await LogEntry.save();
        res.json(createdEntry);
        
    } catch (error) {
        console.log(error.name)
        if (error.name === 'ValidationError'){
          res.status(422)
        }
        next(error);
    }
    
});

router.delete('/', async (req, res, next) => {
  try{
    //const entries = await blogentry.deleteOne({title: "empire state building"})
    const entries = await blogentry.deleteOne(req.body)
  ;  
  res.send(entries );
} catch (error){
  next(error);
}}
)
  





module.exports = router;