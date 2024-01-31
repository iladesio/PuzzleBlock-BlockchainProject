// helloworld.js located in /api/user
const { Console } = require('console');
const express = require('express')
const router = express.Router();


router.post('/register', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const ethUtil = require('ethereumjs-util');
    const keccak256 = require('keccak');
    const EthereumTx = require('ethereumjs-tx').Transaction

    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
    contractName = 'GameManager';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log(contractAddress)

    // Encode the function call
    const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[2], []);

    // Example data
    const transaction = {
        'gasPrice': '0x53FC',
        'gasLimit': '0x746A528800',
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
    const tx = new EthereumTx(transaction);

    
    //tx.from = userAddress

    // Ottieni la rappresentazione RLP della transazione senza la firma
    const unsignedTransactionData = '0x' + tx.serialize().toString('hex');

    // Keccak-256 hashing
    const hashOfTransactionData = keccak256('keccak256').update(unsignedTransactionData).digest('hex');
    
    console.log('Unsigned Transaction Data:', unsignedTransactionData.toString('hex'));
    console.log('Hash of Transaction Data:', hashOfTransactionData);
    res.json({"unsignedTransactionData": unsignedTransactionData.toString('hex'), "hash_transaction": hashOfTransactionData})
    return res;
     
});


router.post('/registerSigned', (req, res) => {
  
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const EthereumTx = require('ethereumjs-tx').Transaction;
    const { rlp, toBuffer } = require('ethereumjs-util');

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    signature = req.body.signature;

    console.log(signature)

    const transactionData = req.body.unsignedTransactionData

    // Decodifica la rappresentazione RLP
    const decodedTransaction = rlp.decode(toBuffer(transactionData));

    // Crea un'istanza di EthereumTx con i dati decodificati
    const tx_signed = new EthereumTx(decodedTransaction);

    //const tx_signed = new EthereumTx(Buffer.from(transactionData))

    const rawTransaction_unsigned = '0x' + tx_signed.serialize().toString('hex');
    
    console.log('Raw Transaction Unsigned:', rawTransaction_unsigned);

    //const transactionData_Buffer=Buffer.from(transactionData.slice(2), 'hex')
    //console.log("transaction data buffer:",transactionData_Buffer)
    //console.log(typeof(transactionData_Buffer))

    // Convert the signature to Buffer
    const signatureBuffer = Buffer.from(signature.slice(2), 'hex');

    // Extract r, s, and v from the signature
    const r = signatureBuffer.slice(0, 32);
    const s = signatureBuffer.slice(32, 64);
    const v = signatureBuffer.slice(64);

    
  // Set the RLP-encoded transaction data
 /* const tx = new EthereumTx({
    raw : Buffer.from(transactionData, 'hex'),
    r : signatureBuffer.slice(0, 32),
    s : signatureBuffer.slice(32, 64),
    v : signatureBuffer.slice(64),
  });*/

    tx_signed.v = v
    tx_signed.r = r
    tx_signed.s = s

    tx_address = tx_signed.getSenderAddress()
    console.log("Sender Address: " + tx_address)
    console.log("Signature: " + signature)
    console.log("s: " + s)
    console.log("v: " + v)
    console.log("r: " + r)

    //console.log(tx_signed)

    const rawTransaction_signed = '0x' + tx_signed.serialize().toString('hex');
    
    console.log('Raw Transaction:', rawTransaction_signed);

    web3.eth.sendSignedTransaction(rawTransaction_signed)
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

});


// Export the router
module.exports = router;