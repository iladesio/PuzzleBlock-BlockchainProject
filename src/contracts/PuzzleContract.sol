// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PuzzleBlock {
   
    // Definition of the struct that represent the User
    struct User {
        address userAddress;
        string ipfsCid;
    }
    // Mapping from each Ethereum address to each user 
    mapping(address => User) private users;

    // Emit event UserRegistered when a new user is registered
    // Emit event UserUpdated when information about a already registered user are updated
    event UserRegistered(address userAddress,string ipfsCid);
    event UserUpdated(address userAddress,string ipfsCid);

    /* function registerUser:  to register a new User
    @param _userAddress The Ethereum address of the user to be registered
    @param _ipfsCid The IPFS CID (Content Identifier) string that points to additional user data
    */
    function registerUser(address _userAddress, string memory _ipfsCid) external {
        // Check if is already registered 
        require(users[_userAddress].userAddress == address(0), "User already registered.");

        // Create a new User and add it to the mapping
        users[_userAddress] = User({
            userAddress: _userAddress,
            ipfsCid: _ipfsCid
        });

        // Emit event UserRegistered
        emit UserRegistered(_userAddress,_ipfsCid);
    }

    /* function getUserInfo: to retrieve information of a user
    @param _userAddress The Ethereum address of the user 
    */
    function getUserInfo(address _userAddress) external view returns ( string memory ipfsCid )
    {
        if(users[_userAddress].userAddress == address(0)) return ("0");
        User storage user = users[_userAddress];
        return (user.ipfsCid);
    }

    /* function editUser: to edit information of a user
    @param _userAddress The Ethereum address of the user 
    @param _ipfsCid The IPFS CID (Content Identifier) strings
    */
    function editUser(address _userAddress, string memory _ipfsCid) external {
        // Check if is already registered 
        require(users[_userAddress].userAddress != address(0), "User not found");
        
        users[_userAddress].ipfsCid = _ipfsCid;

        // Emit event UserUpdated
        emit UserUpdated(_userAddress, _ipfsCid);
    }

}