// helloworld.js located in /api/user
const express = require('express')
const router = express.Router();


router.post('/register', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const ethUtil = require('ethereumjs-util');
    const keccak256 = require('keccak');

    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
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
        'gas': '0x20c855800',
        'gasLimit': '0x5208',
        'nonce': '0x1',
        'data': functionCall, 
    };
  
    // Ethereum RLP encoding
    /*const unsignedTransactionData = ethUtil.rlp.encode([
        ethUtil.toBuffer(transaction.nonce),
        ethUtil.toBuffer(transaction.gasPrice),
        ethUtil.toBuffer(transaction.gasLimit),
        ethUtil.toBuffer(transaction.to),
        ethUtil.toBuffer(transaction.value),
        ethUtil.toBuffer(transaction.data),
    ]);*/

    // Crea un'istanza di EthereumTx con i dati della transazione
    const tx = new EthereumTx(transaction, { chain: 'mainnet', hardfork: 'merge' });

    // Ottieni la rappresentazione RLP della transazione senza la firma
    const unsignedTransactionData = '0x' + tx.serialize().toString('hex');

    // Keccak-256 hashing
    const hashOfTransactionData = keccak256('keccak256').update(unsignedTransactionData).digest('hex');
    
    console.log('Unsigned Transaction Data:', unsignedTransactionData.toString('hex'));
    console.log('Hash of Transaction Data:', hashOfTransactionData);
    res.json({"unsignedTransactionData": unsignedTransactionData.toString('hex'), "hash_transaction": hashOfTransactionData})

    /*0x15dec2ec4d4fed4f2ad0811910191d475e7d2d82e25f4a49221cb307d5ff688d3d8fcde49dbf19d96b40874165651f323a1834c0d31e8f73491af820bf5ffb771b*/
    
    

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


router.post('/registerSigned', (req, res) => {
   // Example data
   /*const transaction = {
    'from': req.body.from,
    'value': req.body.value,
    'gasPrice': req.body.gasPrice,
    'gasLimit': req.body.gasLimit,
    'nonce': req.body.nonce,
    'data': req.body.data, 
};*/

const {Web3} = require('web3'); // Importare Web3 correttamente
const EthereumTx = require('ethereumjs-tx').Transaction;

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

signature = req.body.signature;

console.log(signature)

const transactionData = 'cc01808252088000844d3820eb'


// Convert the signature to Buffer
const signatureBuffer = Buffer.from(signature.slice(2), 'hex');

// Extract r, s, and v from the signature
const r = signatureBuffer.slice(0, 32);
const s = signatureBuffer.slice(32, 64);
const v = signatureBuffer.slice(64);
  
  // Set the RLP-encoded transaction data
  const tx = new EthereumTx({
    raw : Buffer.from(transactionData, 'hex'),
    r : signatureBuffer.slice(0, 32),
    s : signatureBuffer.slice(32, 64),
    v : signatureBuffer.slice(64),
  });
  
  // Get the raw transaction data (including RLP-encoded transaction data and signature)
  const rawTransaction = '0x' + tx.serialize().toString('hex');
  
  console.log('Raw Transaction:', rawTransaction);

web3.eth.sendSignedTransaction(rawTransaction)
.on('transactionHash', (hash) => {
    console.log('Transaction Hash:', hash);
})
.on('confirmation', (confirmationNumber, receipt) => {
    console.log('Confirmation Number:', confirmationNumber);
    console.log('Receipt:', receipt);
})
.on('error', (error) => {
    console.error('Error sending signed transaction:', error);
});

// Serializza la transazione firmata
//const serializedTransaction = signedTransaction.serialize();

// Invia la transazione alla rete Ethereum
//const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'));

});


// Export the router
module.exports = router;