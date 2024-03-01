// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PuzzleBlock {
   
    // Definizione della struct User per memorizzare le informazioni degli utenti
    struct User {
        address userAddress;
        string ipfsCid;
        uint256 startTimestamp;
        uint256 endTimestamp;
    }

    //Not SAFE
    struct NFT {
        string assetIPFS;
        uint8 Id; //"number of series"
        uint8 maxUnits;
        uint8 unitsMinted;
    }
    NFT[] public nfts;

    mapping(address => string) private NFTs;

    // Mapping per associare ogni indirizzo Ethereum a un utente
    mapping(address => User) private users;

    // Evento che verrà emesso quando un nuovo utente viene registrato
    event UserRegistered(address userAddress,string ipfsCid);
    event UserUpdated(address userAddress,string ipfsCid);
    event ValidateTimestamp(address userAddress,string ipfsCid, uint256 timestamp);

    // Funzione per registrare un nuovo utente
    function registerUser(address _userAddress, string memory _ipfsCid) external {
        // Assicurati che l'indirizzo non sia già registrato
        require(users[_userAddress].userAddress == address(0), "User already registered.");

        // Crea un nuovo utente e lo aggiunge al mapping
        users[_userAddress] = User({
            userAddress: _userAddress,
            ipfsCid: _ipfsCid,
            startTimestamp: 0,
            endTimestamp: 1
        });

        // Emetti l'evento di registrazione
        emit UserRegistered(_userAddress,_ipfsCid);
    }

    function getUserInfo(address _userAddress) external view returns ( string memory ipfsCid )
    {
        if(users[_userAddress].userAddress == address(0)) return ("0");
        User storage user = users[_userAddress];
        return (user.ipfsCid);
    }

    // Funzione per registrare un nuovo utente
    function editUser(address _userAddress, string memory _ipfsCid, uint256 _startTimestamp, uint256 _endTimestamp, uint256 _levelDuration) external {
        // Verifica che l'indirizzo sia già registrato
        require(users[_userAddress].userAddress != address(0), "User not found");

        require((_startTimestamp > 0 && _endTimestamp == 0) || (_startTimestamp == 0 && _endTimestamp == 0) || (_startTimestamp == 0 && _endTimestamp > 0), "Invalid timestamp");
        if(_startTimestamp > 0){
          users[_userAddress].startTimestamp = _startTimestamp;
          users[_userAddress].endTimestamp = _endTimestamp;
        }
        if(_endTimestamp > 0){
          require(_endTimestamp - users[_userAddress].startTimestamp <= _levelDuration, "Timestamp exceeded level duration!");
          users[_userAddress].startTimestamp = _startTimestamp;
          users[_userAddress].endTimestamp = _endTimestamp;
        }
        
        // Sostituisce ipfs cid
        users[_userAddress].ipfsCid = _ipfsCid;

        // Emetti l'evento di registrazione
        emit UserUpdated(_userAddress, _ipfsCid);
    }

    function validateTimestamp(address _userAddress, string memory _ipfsCid, uint256 _timestamp) external {
        // Emetti l'evento di validazione
        emit ValidateTimestamp(_userAddress, _ipfsCid, _timestamp);
    }





    /*function usePowerups(address _userAddress, uint8 typePowerup) external {
        // Verifica che l'utente sia registrato
        require(users[_userAddress].userAddress != address(0), "User not found.");

        // Aggiorna il numero di powerup in base al tipo (0:Ametista, 1:Grimorio, 2:Pozione)
        if(typePowerup == 0) { // Ametista
            require(users[_userAddress].amethystNumber > 0, "Not enough Amethysts.");
            users[_userAddress].amethystNumber -= 1;
        } else if(typePowerup == 1) {
            require(users[_userAddress].grimoireNumber > 0, "Not enough Grimoires.");
            users[_userAddress].grimoireNumber -= 1;
        } else if(typePowerup == 2) {
            require(users[_userAddress].potionNumber > 0, "Not enough Potions.");
            users[_userAddress].potionNumber -= 1;
        } else {
            // Se il tipo di powerup non è riconosciuto, viene lanciato un errore
            revert("Invalid powerup type.");
        }
    }*/

    /*function buyPowerups(address _userAddress, uint8 typePowerup) external {
    // Verifica che l'utente sia registrato
        require(users[_userAddress].userAddress != address(0), "User not found.");

    // Controlla il tipo di powerup e verifica che l'utente non abbia già 3 powerup di quel tipo prima di incrementarne il numero.
    //(0:Ametista, 1:Grimorio, 2:Pozione)
        if(typePowerup == 0) { 
            require(users[_userAddress].amethystNumber < 3, "Maximum Amethysts reached.");
            users[_userAddress].amethystNumber += 1;
        } else if(typePowerup == 1) { 
            require(users[_userAddress].grimoireNumber < 3, "Maximum Grimoires reached.");
            users[_userAddress].grimoireNumber += 1;
        } else if(typePowerup == 2) { 
            require(users[_userAddress].potionNumber < 3, "Maximum Potions reached.");
            users[_userAddress].potionNumber += 1;
        } else {
            // Se il tipo di powerup non è riconosciuto, viene lanciato un errore
            revert("Invalid powerup type.");
        }
    }*/

    /*function getPowerups(address _userAddress) external view returns (uint8 amethystNumber, uint8 grimoireNumber, uint8 potionNumber) {
        // Verifica che l'utente sia registrato
        require(users[_userAddress].userAddress != address(0), "User not found.");

        // Restituisce il numero di powerups per l'utente
        User storage user = users[_userAddress];
        return (user.amethystNumber, user.grimoireNumber, user.potionNumber);
    }*/

    //@typeBalance (0: primary o 1: secondary);
    //@typeOperation (0: decrement o 1: increment);
    //@amount quantità di denaro su cui effettuare l'operazione
    //Funzione per utilizzare il saldo di un utente (incremento o decremento su saldo primario o secondario)
    /*function useBalance(address _userAddress, uint8 typeBalance, uint8 typeOperation, uint256 amount) external {
        require(users[_userAddress].userAddress != address(0), "User not found.");
        require(typeBalance == 0 || typeBalance == 1, "Invalid balance type.");
        require(typeOperation == 0 || typeOperation == 1, "Invalid operation type.");

        if (typeBalance == 0) { // Primary Balance
            if (typeOperation == 0) { // Decrement
                require(users[_userAddress].primaryBalance >= amount, "Insufficient primary balance.");
                users[_userAddress].primaryBalance -= amount;
            } else { // Increment
                users[_userAddress].primaryBalance += amount;
            }
        } else if (typeBalance == 1) { // Secondary Balance
            if (typeOperation == 0) { // Decrement
                require(users[_userAddress].secondaryBalance >= amount, "Insufficient secondary balance.");
                users[_userAddress].secondaryBalance -= amount;
            } else { // Increment
                users[_userAddress].secondaryBalance += amount;
            }
        }
    }*/

    //DA MODIFICARE AFTER
    /*function creditToBalance(address _userAddress) external {
        // Verifica che l'utente sia registrato nel sistema
        require(users[_userAddress].userAddress != address(0), "User not found.");

        // Ottiene l'utente dal mapping
        User storage user = users[_userAddress];

        // Aggiunge il saldo secondario al saldo primario
        user.primaryBalance += user.secondaryBalance;
        
        // Azzera il saldo secondario
        user.secondaryBalance = 0;
    }*/
    
}