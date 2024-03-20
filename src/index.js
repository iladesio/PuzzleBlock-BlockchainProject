require('dotenv').config();
const fs = require('fs'); 
const {Web3} = require('web3'); 
const path = require('path');
const pinataSDK = require('@pinata/sdk');

var constants = require('./constants');

// Connection to the local provider of Ethereum 
web3 = new Web3(new Web3.providers.HttpProvider(constants.GANACHE_URL));


async function startEndPoint() {
    const express = require('express');
    const bodyParser = require('body-parser');
    console.log("Current directory:", __dirname);
    const app = express();
    // Adjust the limit for incoming requests
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Add headers before the routes are defined
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    const contract = require('./api/contracts/contract');
    const ipfs = require('./api/ipfs/ipfs');
    const user = require('./api/user/user')
    const nft = require('./api/nft/nft')

    app.use('/api/contracts', contract);
    app.use('/api/ipfs', ipfs);
    app.use('/api/user', user);
    app.use('/api/nft', nft);


    app.listen(constants.PORT, () => console.log(`web server listening on port ${constants.PORT}!`))
        
}

startEndPoint();

