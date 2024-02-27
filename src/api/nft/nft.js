const { Console } = require('console');
const express = require('express');
const router = express.Router();
const { Web3 } = require('web3'); // Importare Web3 correttamente
var constants = require('../../constants');

router.post('/mintNFT', (req, res) => {
    try {
        //creare n token per ciascuna categoria definita in constants chiamando la funzione  function createToken (address account,uint256[] memory ids,uint256[] memory amounts,bytes memory data) public 
        print("Hello World")


    } catch (e) {
        res.status(500).send("Cannot mint NFTs: " + e);
    }
});

// Export the router
module.exports = router;