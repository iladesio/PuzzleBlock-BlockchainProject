const fs = require('fs'); // Rimuovere 'node:' per evitare problemi di compatibilità
const {Web3} = require('web3'); // Importare Web3 correttamente

const path = require('path');
const filePath = path.resolve(__dirname, './contracts/SimpleTransaction.txt');

// Connessione al provider locale di Ethereum
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// Carica l'ABI e il bytecode del contratto
const ABI = require('./contracts/SimpleTransaction.json');
const bytecode = fs.readFileSync(filePath, 'utf8');

/*const deploy = async () => {
    try {
        // Ottieni l'elenco degli account dal tuo provider
        const accounts = await web3.eth.getAccounts();

        // Crea un nuovo contratto con Web3 e l'ABI del contratto
        const myContract = new web3.eth.Contract(ABI);

        // Opzioni per il deploy: from, gas, e data (bytecode)
        const deployOptions = {
            from: accounts[0], // Indirizzo che deploya il contratto
            gas: 1500000,      // Imposta un limite di gas adeguato
            data: bytecode
        };
        console.log(typeof(accounts[0]))
        // Effettua il deploy del contratto
        const deployedContract = await myContract.deploy(deployOptions).send();

        // Stampa l'indirizzo del contratto deployato
        console.log('Contratto deployato all\'indirizzo:', deployedContract.options.address);
    } catch (error) {
        console.error('Errore durante il deploy:', error);
    }
};*/

contract = new web3.eth.Contract(ABI);

web3.eth.getAccounts().then((accounts) => {
    // Display all Ganache Accounts
    console.log("Accounts:", accounts);
 
    mainAccount = accounts[0];
 
    // address that will deploy smart contract
    console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: bytecode })
        .send({ from: mainAccount, gas: 470000 })
        .on("receipt", (receipt) => {
 
            // Contract Address will be returned here
            console.log("Contract Address:", receipt.contractAddress);
        })
});