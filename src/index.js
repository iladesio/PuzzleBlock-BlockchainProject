require('dotenv').config();
const fs = require('fs'); 
const {Web3} = require('web3'); 
const path = require('path');
const pinataSDK = require('@pinata/sdk');

var constants = require('./constants');

// Connection to the local provider of Ethereum 
web3 = new Web3(new Web3.providers.HttpProvider(constants.GANACHE_URL));

// async function used to Deploy multiple contracts in constants.js
async function deployContracts() {
    let contractsInfo = {};
    
    console.log("Total number of contracts to deploy:", constants.CONTRACTS.length);

    var puzzleBlockAddress = "-";

    for (let contractData of constants.CONTRACTS) {
        const filePath = path.resolve(__dirname, './contracts/' + contractData['name'] + '.txt');

        // Load the ABI and the bytecode of the contract
        const ABI = require('./contracts/' + contractData['name'] + '.json');
        const bytecode = fs.readFileSync(filePath, 'utf8');
        
        console.log("Deploying Contract:", contractData['name']);
        let contractInstance = new web3.eth.Contract(ABI);
        
        //initialize collections of NFTs
        if(contractData['name'] == 'GameAsset'){

            if(puzzleBlockAddress === "-"){
                console.log("PuzzleBlock must be deployed before than GameAsset contract. Please change the order of the contracts in constants.CONTRACTS");
                process.exit(1);
            }

            var ids = [];
            var amounts = [];
            var prices = [];

            for(let i = 0; i < constants.ASSETS.length; i++) {
                ids.push(constants.ASSETS[i]['id']);
                amounts.push(constants.ASSETS[i]['amount']);
                prices.push(constants.ASSETS[i]['price']);
            }
        }
        var newContract;
        try {
            if(contractData['name'] == 'GameAsset'){
                newContract = await contractInstance
                    .deploy({ data: bytecode,
                            arguments: [ids, amounts, prices, puzzleBlockAddress] 
                    })
                    .send({ from: constants.ADMIN_ACCOUNT, gas: 4700000 });
            } else {
                newContract = await contractInstance
                .deploy({ data: bytecode })
                .send({ from: constants.ADMIN_ACCOUNT, gas: 4700000 });

                if(contractData["name"] == "PuzzleContract"){
                    puzzleBlockAddress = newContract.options.address;
                }
            }
            
            console.log("Contract Address:", newContract.options.address);

            contractsInfo[contractData['name']] = newContract.options.address

            fs.writeFileSync(constants.CONTRACTS_JSON, JSON.stringify(contractsInfo, null, 2));
            console.log('Contracts information has been saved to ' + constants.CONTRACTS_JSON);

        } catch (error) {
            console.error("Error deploying contract:", contractData['name'], error);
        }
    }
    
}

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

deployContracts();
startEndPoint();

