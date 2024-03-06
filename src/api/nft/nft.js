const { Console } = require('console');
const express = require('express');
const router = express.Router();
const { Web3 } = require('web3'); // Importare Web3 correttamente
var constants = require('../../constants');
const axios = require('axios')


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
        var hash = asset.uri.substring(asset.uri.indexOf("ipfs/") + 5);
        await axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                hash: hash
        }).then((response) => {
            asset.name = response.data.name;
            asset.description = response.data.description;
            asset.rarity = response.data.properties.rarity;
            asset.fanciness = response.data.properties.fanciness;
            asset.imageURI = response.data.image;
            //invoke post request to localhost:3000/api/ipfs/getPinnedJson
            
        }).catch(function (error) {
            throw "Cannot read from IPFS: " + error.response.data;
        });

        res.json(asset);


    } catch (e) {
        res.status(500).send("Cannot mint NFTs: " + e);
    }
});

router.post('/getImage', async (req, res) => {

    uri = req.body.uri;

    await axios.post("http://localhost:3000/api/ipfs/getPinnedImage", {
        hash: uri
    }).then((response) => {
                
    // Creare un oggetto TextEncoder
    /*var encoder = new TextEncoder();
    // Convertire la stringa in un array di byte
    var byteArray = encoder.encode(response.data);
    asset.image = Buffer.from(byteArray).toString('base64');*/

    // Convert the string of bytes to a Buffer
        /*let buffer = Buffer.from(response.data, 'binary');
        console.log(response.data)
        // Encode the Buffer as Base64
        b64Image = buffer.toString('base64');

        console.log(b64Image);

        
        res.send(b64Image.replace());*/
        res.writeHead(200, {
            'Content-Type': 'image/png',
        });
        res.end(response.data); 
    }).catch(function (error) {
        throw "Cannot read from IPFS: " + error;
    });
});

// Export the router
module.exports = router;