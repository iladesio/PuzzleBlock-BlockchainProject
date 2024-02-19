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
    function registerUser(address _userAddress, uint256 _nickname, uint256 _primaryBalance, uint256 _secondaryBalance,uint24 _points, 
                        uint8 _currentLevel,uint8 _amethystNumber,uint8 _grimoireNumber,uint8 _potionNumber) external {
        // Assicurati che l'indirizzo non sia già registrato
        require(users[_userAddress].userAddress == address(0), "User already registered.");

        // Crea un nuovo utente e lo aggiunge al mapping
        users[_userAddress] = User({
            userAddress: _userAddress,
            nickname: _nickname,
            primaryBalance: _primaryBalance,
            secondaryBalance: _secondaryBalance,
            points: _points,
            currentLevel: _currentLevel,
            amethystNumber: _amethystNumber,
            grimoireNumber: _grimoireNumber,
            potionNumber: _potionNumber
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

}
