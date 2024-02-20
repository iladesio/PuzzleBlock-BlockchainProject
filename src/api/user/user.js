const { Console } = require('console');
const express = require('express');
const router = express.Router();
const {Web3} = require('web3'); // Importare Web3 correttamente

router.post('/userInfo', async (req, res) => { 
    var address = req.body.address

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
                res.json({"error": "cannot read from IPFS"})
            }        
        }
    } catch (error) {
        return res.json({"error": error})
    }

    
    
	
    
    // If the method was only to read form the Blockchain: 
    //const result = await contract.methods.getUserInfo(address).call();
    //console.log(result)
    //If an hash is retrieved, than call the get on ipfs and return the json object
    //else return a string 'no user found'
});

// Export the router
module.exports = router;