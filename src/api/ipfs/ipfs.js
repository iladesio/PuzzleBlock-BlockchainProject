const { Console } = require('console');
const express = require('express');
const router = express.Router();
const pinataSDK = require('@pinata/sdk');
const axios = require('axios')
var constants = require('../../constants');

router.post('/pinJson', (req, res) => {

    jsonObject = req.body.jsonObject
    filename = req.body.filename
    //const fs = require('fs')
    const { PINATA_API_KEY, SECRET_PINATA_API_KEY } = process.env;
    const pinata = new pinataSDK(PINATA_API_KEY, SECRET_PINATA_API_KEY);

    //const src = "user.json";
    //const file = fs.createReadStream(src)
    const options = {
        pinataMetadata: {
            name: filename}
    };
    
    // We pass in the readable stream for the file, ******and****** the options object.
    pinata.pinJSONToIPFS(jsonObject,options).then((result) => {
        //handle results here
        return res.json({ "result": result.IpfsHash });
    }).catch((err) => {
        //handle error here
        return res.json({"error": "impossible to load data on IPFS"})
    });

});


router.post('/getPinnedJson', async (req, res) => {

    hash = req.body.hash
    const { PINATA_GATEWAY_TOKEN} = process.env;

    url = constants.PINATA_GATEWAY + '/ipfs/' + hash

    console.log(url)

    header = {'x-pinata-gateway-token': PINATA_GATEWAY_TOKEN}

    try{

        const ipfs_res = await axios.get(url, {
            maxBodyLength: "Infinity",
            headers: header
        });
        return res.json(ipfs_res.data);

    } catch (error) {
        return res.json({"error": "Cannot retrieve file"})
    }

});


router.post('/unpinJson', async (req, res) => {

    hash = req.body.hash
    const { PINATA_API_KEY, SECRET_PINATA_API_KEY } = process.env;
    const pinata = new pinataSDK(PINATA_API_KEY, SECRET_PINATA_API_KEY);

    // We pass in the readable stream for the file, ******and****** the options object.
    pinata.unpin(hash).then((result) => {
        //handle results here
        return res.json({ "result": "OK" });
    }).catch((err) => {
        //handle error here
        return res.json({"error": "impossible to unpin json"})
    });

});


// Export the router
module.exports = router;