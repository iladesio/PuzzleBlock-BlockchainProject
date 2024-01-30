// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract GameManager {
    address public owner;
    
    //add run, power ups, token primari e token secondari. 
    struct User {
        bool isRegistered;
        uint256 global_score;
        uint256 cryptocoin;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser() external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        User memory newUser = User({
            isRegistered: true,
            global_score: 0,
            cryptocoin: 0
        });

        users[msg.sender] = newUser;

        emit UserRegistered(msg.sender);
    }

    function updateScore(uint256 newScore) external {
        require(users[msg.sender].isRegistered, "User not registered");
        
        // Add any additional logic for updating the score here
        
        users[msg.sender].global_score = newScore;
    }

    function addCryptocoin(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        
        // Add any additional logic for handling cryptocoin here
        
        users[msg.sender].cryptocoin += amount;
    }
}
