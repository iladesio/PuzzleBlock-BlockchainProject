// helloworld.js located in /api/user
const { Console } = require('console');
const express = require('express')
const router = express.Router();


router.post('/register', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const { RLP } = require('@ethereumjs/rlp')
    const { Chain, Common, Hardfork } = require('@ethereumjs/common')
    const { bytesToHex } = require('@ethereumjs/util')
   
    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
    contractName = 'HelloWorld';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log(contractAddress)

    // Encode the function call
    //const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[2], []);
    const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[0], []);
    
    // Example data
    const { LegacyTransaction } = require('@ethereumjs/tx')    

    const txData = {
        nonce: '0x00',
        gasPrice: '0xA',
        gasLimit: '0x669153',
        to: '0x0000000000000000000000000000000000000000',
        value: '0x00',
        data: functionCall
    }

    const common = Common.custom({ chainId: 1337 })
    const tx = LegacyTransaction.fromTxData(txData, {common})
    
    var transaction_serialized = bytesToHex(tx.serialize())

    return res.json({"unsignedTransactionData": transaction_serialized})
 
});


router.post('/registerSigned', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const { RLP } = require('@ethereumjs/rlp')
    const { Chain, Common, Hardfork } = require('@ethereumjs/common')
    const { hexToBytes, bytesToHex } = require('@ethereumjs/util')

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    signature = req.body.signature;

    console.log(signature)

    const transactionData = req.body.unsignedTransactionData

    console.log(transactionData)

    // Decodifica la rappresentazione RLP
    transactionData_bytes = hexToBytes(transactionData)
    
    // Example data
    const { LegacyTransaction } = require('@ethereumjs/tx')    

    // Crea un'istanza di EthereumTx con i dati decodificati
    const tx_signed = LegacyTransaction.fromSerializedTx(transactionData_bytes);

    signedTx_serialized_string = bytesToHex(tx_signed.serialize())
    console.log("signed serialized transaction:" + signedTx_serialized_string);

    // Estrai r, s, e v dalla firma
   /* const r = signature.slice(0, 66); // Primi 32 byte
    const s = '0x' + signature.slice(66, 130); // Secondi 32 byte
    const v = '0x' + signature.slice(130, 132); // Ultimo byte
*/  

    console.log(signature)

    // Extract r, s, and v from the signature
    const r = '0x'+signature.slice(2, 66);
    const s = '0x'+signature.slice(66, 130);
    const v = '0x'+signature.slice(130);


    console.log(r)
    console.log(s)
    console.log(v)

    // Crea un oggetto Buffer per s, v, r
    const sBuffer = hexToBytes(s)
    const rBuffer = hexToBytes(r)
    var v_bigint = BigInt(v);

    console.log("sBuffer: " + sBuffer)
    console.log("rBuffer: " + rBuffer)
    console.log("v: " + v_bigint)

    //tx_signed._processSignature(vBuffer,rBuffer,sBuffer)
    var tx_signed_vsr = tx_signed._processSignature(v_bigint, rBuffer, sBuffer)

    //console.log(tx_signed)

    const rawTransaction_signed = bytesToHex(tx_signed_vsr.serialize());
    
    console.log('Raw Transaction:', rawTransaction_signed);
    check = tx_signed_vsr.verifySignature()
    console.log("verifica signature : "+ check)

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



    return res.json({"result": rawTransaction_signed})

    
});


router.post('/registerSignedDebug', (req, res) => {
  
    const {Web3} = require('web3'); // Importare Web3 correttamente
    //const { rlp, toBuffer } = require('ethereumjs-util');

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    rawTransaction_signed = req.body.transaction;

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

router.post('/testHelloWorld', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const { RLP } = require('@ethereumjs/rlp')
    const { Chain, Common, Hardfork } = require('@ethereumjs/common')
    const { bytesToHex } = require('@ethereumjs/util')
    //const keccak256 = require('keccak');
    //const EthereumTx = require('ethereumjs-tx').Transaction

    userAddress = req.body.address

    // Connessione al provider locale di Ethereum
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
    contractName = 'HelloWorld';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log(contractAddress)

    // Encode the function call
    //const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[2], []);
    const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[0], []);

    //const common = new Common({ chain: Chain.Mainnet,  hardfork: Hardfork.MergeForkIdTransition  })

    const { LegacyTransaction } = require('@ethereumjs/tx')    
    const txData = {
        nonce: '0x00',
        gasPrice: '0xA',
        //gasLimit: '0x6691B7',
        gasLimit: '0x669153',
        to: '0x0000000000000000000000000000000000000000',
        value: '0x00',
        data: functionCall
    }

    const common = Common.custom({ chainId: 1337 })
    const tx = LegacyTransaction.fromTxData(txData, {common})
    const message = tx.getMessageToSign()
    const serializedMessage = RLP.encode(message)

    console.log(tx)

    transaction_encoded_string = '0x' + Buffer.from(serializedMessage).toString('hex');

    // Keccak-256 hashing
    //const hashOfTransactionData = keccak256('keccak256').update(unsignedTransactionData).digest('hex');
    
    console.log('Unsigned Transaction Data:', transaction_encoded_string);
    console.log('Unsigned Transaction Data type:', typeof(serializedMessage));
    console.log('Unsigned Transaction Data string:', serializedMessage);

    //account 0x87132fa3c45dfdd7271D667917056E642Fd14184
    var private_key = Buffer.from('bf68b97be2650354c46c74428150c807d780ee26c978d454b11de5db45d3413e', 'hex');
      
    
    console.log("private key in bytes: " + private_key)
    const signedTx = tx.sign(private_key)

    if (signedTx.verifySignature() === true)
        console.log("signature verified");

    signedTx_serialized = signedTx.serialize()
    signedTx_serialized_string = bytesToHex(signedTx.serialize())
    console.log(signedTx_serialized_string);

    web3.eth.sendSignedTransaction(signedTx_serialized_string)
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




    //signed_transaction_encoded_string = '0x' + Buffer.from(serializedMessageSigned).toString('hex');

    //console.log('Signed Transaction Data:', signed_transaction_encoded_string);


   //return res.json({"result": signed_transaction_encoded_string})


    //console.log('Hash of Transaction Data:', hashOfTransactionData);
    res.json({"unsignedTransactionData": transaction_encoded_string})
    return res;


});


// Export the router
module.exports = router;