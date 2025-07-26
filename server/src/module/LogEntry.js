import mongoose from 'mongoose';
//const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

//const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
};

const reqNum = {
    type: Number,
    required: true,
    
};

const defDate = { 
    type: Date, 
    default: Date.now,
    required: true, 
};

const logEntrySchema = new Schema({
  title: String, // String is shorthand for {type: String}
  description: String,
  comment: String,
  image: String,
  rank: { 
    type: Number,
    min: 0,
    max: 10,
    default: 5, },
  visitDate: {
    type: Date,
  },

  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
}, {
    timestamps: true,
});

// connect to databse
const LogEntry = mongoose.model('LogEntry', logEntrySchema);


// this would be CJS 
//module.exports = LogEntry;
// ES module would be
export default LogEntry; 
