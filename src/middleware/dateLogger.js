function dateLogger( req, res, next ) {
    const start = new Date();
    next();
    console.log( `${req.method} ${req.originalUrl} took ${new Date() - start}ms` );
}

module.exports = {
    dateLogger
}