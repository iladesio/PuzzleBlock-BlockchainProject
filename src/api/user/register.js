// helloworld.js located in /api/user
const express = require('express')
const router = express.Router();


router.post('/', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');

    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    contractName = 'GameManager';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log(contractAddress)

    const contract = new web3.eth.Contract(ABI, contractAddress);

    // Call your contract function
    contract.methods.registerUser().send({
        from: userAddress
    })
    .on('transactionHash', function(hash){
    console.log('Transaction Hash:', hash);
    })
    .on('confirmation', function(confirmationNumber, receipt){
    console.log('Confirmation Number:', confirmationNumber);
    console.log('Receipt:', receipt);
    })
    .on('error', function(error) {
    console.error('Error:', error);
    });
      
    
    return res.send(userAddress);

});


// Export the router
module.exports = router;