const { Console } = require('console');
const express = require('express');
const router = express.Router();
const { Web3 } = require('web3'); // Importare Web3 correttamente
var constants = require('../../constants');

router.post('/getMintedAsset', async (req, res) => {
    try {
        
        tokenId = req.body.tokenId;
        //given the address, call the PuzzleContract function of getUserInfo. 
        var web3 = new Web3(constants.GANACHE_URL);

        const ABI = require('../../contracts/GameAsset.json');
        //console.log("ABI: " + ABI)
        const contractAddress = require('../../contracts/contracts.json')["GameAsset"];
        //console.log("contractAddress: " + contractAddress)

        var contract = new web3.eth.Contract(ABI, contractAddress);
        // Get the current value of my number
        var result = await contract.methods.getAsset(tokenId).call();

        asset = {
            "uri": result[0],
            "amount": Number(result[1]),
            "price": Number(result[2])
        };

        res.json(asset);


    } catch (e) {
        res.status(500).send("Cannot mint NFTs: " + e);
    }
});

// Export the router
module.exports = router;