// helloworld.js located in /api/user
const { Console } = require('console');
const express = require('express')
const router = express.Router();

async function getNonce(accountAddress) {
    try {
        const nonce = await web3.eth.getTransactionCount(accountAddress, "latest");
        return nonce;
    } catch (error) {
        console.error("Errore nel recuperare il nonce:", error);
        throw error;
    }
}

async function getBalance(userAddress) {
    try {
        const balance = await web3.eth.getBalance(userAddress);
        console.log("Saldo dell'utente: ", balance);
        return balance;
    } catch (error) {
        console.error("Errore nel recuperare il saldo:", error);
    }
}

async function createTransaction(userAddress,functionCall) {
    try {
        const nonce = await getNonce(userAddress);
        console.log("Nonce dell'account:", nonce);
        var balance=getBalance(userAddress);
        console.log("Saldo dell'utente: ", balance);

        const txData = {
            nonce: '0x' + nonce.toString(16),
            gasPrice: '0x77359400',
            gasLimit: '0x669153',
            to: '0x0000000000000000000000000000000000000000',
            value: '0x0',
            data: functionCall,
            chainId:'0x539',
            maxPriorityFeePerGas: '0x01',
            maxFeePerGas: '0xff'
        };

        // Utilizza txData qui
        // Ad esempio, invia la transazione o fai altro

        return txData;
    } catch (error) {
        console.error("Errore:", error);
    }
}


router.post('/register', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const { RLP } = require('@ethereumjs/rlp')
    const { Chain, Common, Hardfork } = require('@ethereumjs/common')
    const { bytesToHex } = require('@ethereumjs/util')

    userAddress = req.body.address
    console.log("user address: "+userAddress);

    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    contractName = 'HelloWorld';
    const ABI = require('../../contracts/'+contractName+'.json');
    const contractAddress = require('../../contracts/contracts.json')[contractName];
    console.log("Contract Address: " + contractAddress)

    // Encode the function call
    //const functionCall = new Web3().eth.abi.encodeFunctionCall(ABI[2], []);
    const functionCall = web3.eth.abi.encodeFunctionCall(ABI[0], []);
    console.log(functionCall);
    createTransaction(userAddress,functionCall).then(txData => {
        // txData è disponibile qui
            const { FeeMarketEIP1559Transaction  } = require('@ethereumjs/tx')

            const common = Common.custom({ chainId: 1337 })
            const tx = FeeMarketEIP1559Transaction.fromTxData(txData)
            var transactionRLP= bytesToHex(RLP.encode(tx.serialize()))
            var transaction_hash=bytesToHex(tx.getHashedMessageToSign());
            
            var transaction_serialized = bytesToHex(tx.serialize())
            console.log("transaction_hash: "+transaction_hash);
            return res.json({"unsignedTransactionData": transactionRLP,"transaction_hash": transaction_hash})

        });

    // Connessione al provider locale di Ethereum
    
    // Example data
 
});


router.post('/registerSigned', (req, res) => {
    const {Web3} = require('web3'); // Importare Web3 correttamente
    const path = require('path');
    const { RLP } = require('@ethereumjs/rlp')
    const { Chain, Common, Hardfork } = require('@ethereumjs/common')
    const { hexToBytes, bytesToHex } = require('@ethereumjs/util')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    signature = req.body.signature;

    console.log(signature)

    const transactionData = req.body.unsignedTransactionData

    console.log(transactionData)

    // Decodifica la rappresentazione RLP
    var transactionData_bytes = hexToBytes(transactionData)
    
    // Example data
    const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx')    

    // Crea un'istanza di EthereumTx con i dati decodificati
    const common = Common.custom({chainId: 1337});
    var tx_signed = FeeMarketEIP1559Transaction.fromSerializedTx(transactionData_bytes);

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

    /*const chainId = 1337;

    if(v_bigint == 27){
        v_bigint = BigInt(chainId * 2 + 8);
    }*/


    console.log("sBuffer: " + sBuffer)
    console.log("rBuffer: " + rBuffer)
    console.log("v: " + v_bigint)

    //tx_signed._processSignature(vBuffer,rBuffer,sBuffer)
    tx_signed = tx_signed._processSignature(v_bigint, rBuffer, sBuffer)
    //tx_signed_vsr.common = Common.custom({ chainId: 1337 })
    //console.log(tx_signed)
    var sender_add=tx_signed.getSenderAddress();
    console.log("sender address: "+sender_add);

    const rawTransaction_signed = bytesToHex(tx_signed.serialize());
    
    console.log('Raw Transaction:', rawTransaction_signed);
    check = tx_signed.verifySignature()
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