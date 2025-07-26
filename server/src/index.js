// create express app,, basic app, set up linter

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
// cors add the cross origin resource sharing header  access control origin header
const mongoose = require('mongoose');

require('dotenv').config();

const middleware = require('./middleware');
const logs = require('./api/logs.js');



const app = express();

mongoose.connect(process.env.DATABASE_URL, )

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

//body parsing middleware for mongoose db http post body
app.use(express.json());

// helmet helps rewrite the headers of the network file associated with the website or local host, improve security
// suggestion to hide specific version numbers
// nginx

app.get('/', (req, res) =>{
    res.json({
        message: 'hello world!',
    });
});


app.use('/api/logs', logs);


// not found middleware
app.use(middleware.NotFound);
// error handling middleware

// eslient-disable-next-line no-unused-vars
app.use(middleware.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log('listening at http://localhost:${port}');
});