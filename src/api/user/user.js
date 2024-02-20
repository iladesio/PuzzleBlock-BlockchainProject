const { Console } = require('console');
const express = require('express');
const router = express.Router();
const axios = require('axios')
const {Web3} = require('web3'); // Importare Web3 correttamente

router.post('/userInfo', async (req, res) => { 

    var address = req.body.address

    if(address === undefined){
        return res.json({"error": "address must be set"});
    }

    //given the address, call the PuzzleContract function of getUserInfo. 
    var web3 = new Web3('http://127.0.0.1:7545');
    
    const ABI = require('../../contracts/PuzzleContract.json');
    console.log("ABI: " + ABI)
    const contractAddress = require('../../contracts/contracts.json')["PuzzleContract"]; 
    console.log("contractAddress: " + contractAddress)

    var contract = new web3.eth.Contract(ABI, contractAddress);
    // Get the current value of my number
    try{
        var result = await contract.methods.getUserInfo(address).call();
        if(result == 0){
            return res.json({})
        } else {
            var userJsonHash = web3.utils.hexToAscii(result.toString(16))
            try{
                //invoke post request to localhost:3000/api/ipfs/getPinnedJson
                axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                    hash: userJsonHash
                }).then((response) => {
                    return response
                });
    
            }catch(error){
                return res.json({"error": "cannot read from IPFS"})
            }        
        }
    } catch (error) {
        return res.json({"error": error})
    }
});


router.post('/register', async (req, res) => { 
    var address = req.body.address;
    var username = req.body.username;

    if(address === undefined){
        return res.json({"error": "address must be set"});
    }

    if(username === undefined){
        return res.json({"error": "username must be set"});
    }

    username = '0x'+Buffer.from(username, 'utf8').toString('hex');

    //given the address, call the PuzzleContract function of getUserInfo. 
    var web3 = new Web3('http://127.0.0.1:7545');
    

    const ABI = require('../../contracts/PuzzleContract.json');
    //console.log("ABI: " + ABI)
    const contractAddress = require('../../contracts/contracts.json')["PuzzleContract"]; 
    //console.log("contractAddress: " + contractAddress)

    var contract = new web3.eth.Contract(ABI, contractAddress);
    // Get the current value of my number
    try{
        var result = await contract.methods.getUserInfo(address).call();
        if(result != 0){
            return res.json({"error": "user already registered"})
        } else {

            var userJson = {
                "UserAddress": address,
                "Username": username,
                "PrimaryBalance": 0,
                "SecondaryBalance" :0,
                "Points": 0,
                "CurrentLevel":0,
                "RunCompleted":0,
                "AmethystNumber":0,
                "GrimoireNumber":0,
                "PotionNumber": 0
            }
            try{
                //invoke post request to localhost:3000/api/ipfs/getPinnedJson
                axios.post("http://localhost:3000/api/ipfs/pinJson", {
                    jsonObject: userJson,
                    filename: address
                }).then((response) => {
                    console.log(response.data)
                    return res.json(response.data);
                });
    
            }catch(error){
                return res.json({"error": "cannot read from IPFS"})
            }
        }
    } catch (error) {
        return res.json({"error": error})
    }
});

// Export the router
module.exports = router;