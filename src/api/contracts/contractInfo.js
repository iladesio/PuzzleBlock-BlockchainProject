const { Console } = require('console');
const express = require('express');
const router = express.Router();

router.post('/getContractInfo', (req, res) => {
    const { Web3 } = require('web3'); // Importare Web3 correttamente
    const path = require('path');

    contractName = req.body.contractName;
    contractMethod = req.body.contractMethod;
    if(req.body.inputParameters === undefined) inputParameters=[] 
    else inputParameters=req.body.inputParameters

    console.log("Contract Name: " + contractName);

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const ABI = require('../../contracts/' + contractName + '.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log("Contract Address: " + contractAddress);

    
    // Encode the function call
    var i = 0;
    var found = false;
    var requiresParameters = false

    for (functionElement in ABI) {
        if (functionElement['name'] === contractMethod) {
            found = true;
            if(functionElement[inputs].length>0) requiresParameters=true
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
    if(requiresParameters==true && inputParameters.length==0){
        console.log('inputParameters require');
        return res.status(400).send({
            result: 'inputParameters require'
        });
    }

    const functionCall = web3.eth.abi.encodeFunctionCall(ABI[i], inputParameters);
    console.log(functionCall);

    return res.json({ "contractAddress": contractAddress, "data": functionCall });


});

// Export the router
module.exports = router;