"use strict";

// modules
const express = require( "express" );
const http = require( "http" );

// object
const app = express();
const server = http.Server( app );

// constant
const PORT = process.env.PORT || 3131;
// console.log("process.env.PORT= %d" ,process.env.PORT);

// define the folder for release
app.use( express.static( __dirname) );
// console.log("__dirname= %s", __dirname);

// launching the server
server.listen(
    PORT,
    () =>
    {
        console.log( "Access to 'localhost:%d' !", PORT);
    } );