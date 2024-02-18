// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PuzzleBlock {
   
    // Definizione della struct User per memorizzare le informazioni degli utenti
    struct User {
        uint256 nickname;
        address userAddress;
        uint256 balance;
    }

    // Mapping per associare ogni indirizzo Ethereum a un utente
    mapping(address => User) private users;

    // Evento che verrà emesso quando un nuovo utente viene registrato
    event UserRegistered(uint256 nickname, address userAddress);

    // Funzione per registrare un nuovo utente
    function registerUser(uint256 _nickname, address _userAddress) external {
        // Assicurati che l'indirizzo non sia già registrato
        require(users[_userAddress].userAddress == address(0), "User already registered.");

        // Crea un nuovo utente e lo aggiunge al mapping
        users[_userAddress] = User({
            nickname: _nickname,
            userAddress: _userAddress,
            balance: 0
        });

        // Emetti l'evento di registrazione
        emit UserRegistered(_nickname, _userAddress);
    }

    function getUserInfo(address _userAddress) external view returns (uint256 nickname, address userAddress, uint256 balance) {
        if(users[_userAddress].userAddress == address(0)) return (0,_userAddress,0);
        User storage user = users[_userAddress];
        return (user.nickname, user.userAddress, user.balance);
    }

    // Funzione per aggiornare il saldo di un utente
    function updateUserBalance(address _userAddress, uint256 _newBalance) external {
        require(users[_userAddress].userAddress != address(0), "User not found.");
        users[_userAddress].balance = _newBalance;
    }
}
