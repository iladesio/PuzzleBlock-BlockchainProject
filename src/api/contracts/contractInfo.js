const { Console } = require('console');
const express = require('express');
const router = express.Router();

router.post('/getContractInfo', (req, res) => {
    const { Web3 } = require('web3'); // Importare Web3 correttamente
    const path = require('path');

    contractName = req.body.contractName;
    console.log("Contract Name: " + contractName);

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const ABI = require('../../contracts/' + contractName + '.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log("Contract Address: " + contractAddress);

    contractMethod = req.body.contractMethod;
    // Encode the function call
    var i = 0;
    var found = false;
    for (functionElement in ABI) {
        if (functionElement['name'] === contractMethod) {
            found = true;
            break;
        }
        i += 1;
    }

    if (!found) {
        console.log('Function not found');
        return res.status(404).send({
            result: 'Function not found!'
        });
    }

    const functionCall = web3.eth.abi.encodeFunctionCall(ABI[i], []);
    console.log(functionCall);

    return res.json({ "contractAddress": contractAddress, "data": functionCall });


});

// Export the router
module.exports = router;