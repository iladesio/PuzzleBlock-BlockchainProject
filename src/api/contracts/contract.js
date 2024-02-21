const { Console } = require('console');
const express = require('express');
const router = express.Router();

router.post('/getContractInfo', (req, res) => {
    try {
        const { Web3 } = require('web3'); // Importare Web3 correttamente
        const path = require('path');

        contractName = req.body.contractName;
        contractMethod = req.body.contractMethod;

        if (req.body.inputParameters === undefined) inputParameters = []
        else inputParameters = req.body.inputParameters

        console.log("Contract Name: " + contractName);

        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

        var ABI = require('../../contracts/' + contractName + '.json');
        const contractAddress = require('../../contracts/contracts.json')[contractName];
        console.log("Contract Address: " + contractAddress);

        var i = 0;
        var found = false;
        var requiresParameters = false
        console.log(ABI[0]['name'])
        for (i; i < ABI.length; i += 1) {
            functionElement = ABI[i]

            if (functionElement['name'] === contractMethod) {
                found = true;
                console.log(contractMethod)
                var inputs = functionElement['inputs']

                if (inputs.length > 0) requiresParameters = true
                break;
            }
        }


        if (!found) {
            console.log('Function not found');
            res.status(404).send({
                result: 'Function not found!'
            });
        }
        if (requiresParameters == true && inputParameters.length == 0) {
            console.log('inputParameters require');
            res.status(400).send({
                result: 'inputParameters require'
            });
        }
        console.log(inputParameters);

        const functionCall = web3.eth.abi.encodeFunctionCall(ABI[i], inputParameters);

        console.log(functionCall);

        res.json({ "contractAddress": contractAddress, "data": functionCall });
    }
    catch (e) {
        res.statusCode = 500;
        res.json(e);
    }

});

// Export the router
module.exports = router;