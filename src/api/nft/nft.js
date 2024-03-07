const { Console } = require('console');
const express = require('express');
const router = express.Router();
const { Web3 } = require('web3'); // Importare Web3 correttamente
var constants = require('../../constants');
const axios = require('axios')


router.post('/getMintedAsset', async (req, res) => {
    try {
        
        tokenId = req.body.tokenId;

        if (tokenId === undefined || tokenId === "") {
            throw "tokenId must be set";
        }
        
        //given the tokenIds, call the GameAsset contract 
        var web3 = new Web3(constants.GANACHE_URL);

        const ABI = require('../../contracts/GameAsset.json');

        const contractAddress = require('../../contracts/contracts.json')["GameAsset"];

        var contract = new web3.eth.Contract(ABI, contractAddress);
        // Call the smart contract function "getAsset"  
        var result = await contract.methods.getAsset(tokenId).call();

        asset = {
            "id": tokenId,
            "uri": result[0],
            "amount": Number(result[1]),
            "price": Number(result[2])
        };

        //invoke post request to getPinnedJson
        var hash = asset.uri.substring(asset.uri.indexOf("ipfs/") + 5);
        await axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                hash: hash
        }).then((response) => {
            asset.name = response.data.name;
            asset.description = response.data.description;
            asset.rarity = 0;//TODO CHANGE TO INT ON IPFS response.data.properties.rarity;
            asset.fanciness = response.data.properties.fanciness;
            asset.imageURI = response.data.image;
            
        }).catch(function (error) {
            throw "Cannot read from IPFS: " + error.response.data;
        });

         //invoke post request to getPinnedImage
        await axios.post("http://localhost:3000/api/ipfs/getPinnedImage", {
            hash: asset.imageURI
        }).then((response) => { 
            asset.image = response.data.result;
            res.json(asset);
        }).catch(function (error) {
            throw "Cannot retrieve image from IPFS: " + error;
        });
    } catch (e) {
        res.status(500).send("Cannot retrieve NFT: " + e);
    }

});

// Export the router
module.exports = router;