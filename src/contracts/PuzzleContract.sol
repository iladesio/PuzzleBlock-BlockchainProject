// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PuzzleBlock {
   
    // Definizione della struct User per memorizzare le informazioni degli utenti
    struct User {
        address userAddress;
        uint256 nickname;
        uint256 primaryBalance;
        uint256 secondaryBalance;
        uint24 points;
        uint8 currentLevel;
        uint8 amethystNumber;
        uint8 grimoireNumber;
        uint8 potionNumber;
    }

    // Mapping per associare ogni indirizzo Ethereum a un utente
    mapping(address => User) private users;

    // Evento che verrà emesso quando un nuovo utente viene registrato
    event UserRegistered(address userAddress,uint256 nickname);

    // Funzione per registrare un nuovo utente
    function registerUser(address _userAddress, uint256 _nickname) external {
        // Assicurati che l'indirizzo non sia già registrato
        require(users[_userAddress].userAddress == address(0), "User already registered.");

        // Crea un nuovo utente e lo aggiunge al mapping
        users[_userAddress] = User({
            userAddress: _userAddress,
            nickname: _nickname,
            primaryBalance: 0,
            secondaryBalance: 0,
            points: 0,
            currentLevel: 0,
            amethystNumber: 0,
            grimoireNumber: 0,
            potionNumber: 0
        });

        // Emetti l'evento di registrazione
        emit UserRegistered(_userAddress,_nickname);
    }

    function getUserInfo(address _userAddress) external view 
    returns (
        address userAddress, 
        uint256 nickname, 
        uint256 primaryBalance,
        uint256 secondaryBalance,
        uint24 points, 
        uint8 currentLevel,
        uint8 amethystNumber,
        uint8 grimoireNumber,
        uint8 potionNumber) 
    {
        if(users[_userAddress].userAddress == address(0)) return (address(0),0,0,0,0,0,0,0,0);
        User storage user = users[_userAddress];
        return (user.userAddress,user.nickname,user.primaryBalance,user.secondaryBalance,user.points,user.currentLevel,user.amethystNumber,user.grimoireNumber,user.potionNumber);
    }

    // Funzione per aggiornare il saldo di un utente
    function updateUserSecondaryBalance(address _userAddress, uint256 _amount,bool isPrimary) external {
        require(users[_userAddress].userAddress != address(0), "User not found.");
        if(isPrimary) users[_userAddress].primaryBalance += _amount;
            else users[_userAddress].secondaryBalance += _amount;
    }

    function usePowerups(address _userAddress, uint8 typePowerup) external {
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
    }

    function buyPowerups(address _userAddress, uint8 typePowerup) external {
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
    }

    function getPowerups(address _userAddress) external view returns (uint8 amethystNumber, uint8 grimoireNumber, uint8 potionNumber) {
        // Verifica che l'utente sia registrato
        require(users[_userAddress].userAddress != address(0), "User not found.");

        // Restituisce il numero di powerups per l'utente
        User storage user = users[_userAddress];
        return (user.amethystNumber, user.grimoireNumber, user.potionNumber);
    }

    
}