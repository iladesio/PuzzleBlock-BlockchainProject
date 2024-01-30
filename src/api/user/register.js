// helloworld.js located in /api/user
const express = require('express')
const router = express.Router();


router.post('/', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const ethUtil = require('ethereumjs-util');
    const keccak256 = require('keccak');

    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
    contractName = 'GameManager';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log(contractAddress)

    // Encode the function call
    const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[2], []);

    unsignedTransaction = {"from": userAddress, "data": functionCall}

    // Example data
    const transaction = {
        'from': userAddress,
        'value': '0x0',
        'gasPrice': '0x20c855800',
        'gasLimit': '0x5208',
        'nonce': '0x1',
        'data': functionCall, 
    };
  
    // Ethereum RLP encoding
    const unsignedTransactionData = ethUtil.rlp.encode([
        ethUtil.toBuffer(transaction.nonce),
        ethUtil.toBuffer(transaction.gasPrice),
        ethUtil.toBuffer(transaction.gasLimit),
        ethUtil.toBuffer(transaction.to),
        ethUtil.toBuffer(transaction.value),
        ethUtil.toBuffer(transaction.data),
    ]);
    
    // Keccak-256 hashing
    const hashOfTransactionData = keccak256('keccak256').update(unsignedTransactionData).digest('hex');
    
    console.log('Unsigned Transaction Data:', unsignedTransactionData.toString('hex'));
    console.log('Hash of Transaction Data:', hashOfTransactionData);
    res.json({"unsignedTransactionData": unsignedTransactionData.toString('hex'), "hash_transaction": hashOfTransactionData})

    //res.json({"contractName": contractName, "functionCall": functionCall, "contractAddress": contractAddress, "from": userAddress})

    //const contract = new web3.eth.Contract(ABI, contractAddress);
    
    /*const message = {
        address: contractAddress
    }
    //generate signature
    web3.eth.personal.sign(
        "Hello world",
        "0x5b8f1310A956ee1521A7bB56160451C786289aa9"
    )
    .then((signature) => {
        // do something here with the signature
        console.log(signature)
    });*/

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