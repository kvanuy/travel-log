const NotFound = (req, res, next) => {
    const error = new Error('not found - ${req.originalURL}')
    res.status(404);
    next(error);
};

// eslient-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) =>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.messsage,
        stack : process.env.NODE_ENV === 'production'? 'pancake' : error.stack,
    });
};

module.exports = {
    NotFound,
    errorHandler,
};