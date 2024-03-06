// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameAsset is ERC1155, Ownable{
    /*uint256 public constant SKELECAT = 1;
    uint256 public constant COSMOSQUIT = 2;
    uint256 public constant TECHNOTOK = 3;
    uint256 public constant ARTHURKING = 4;
    uint256 public constant SPARTANWHISKERS = 5;
    uint256 public constant PUMPKINPURR = 6;
    uint256 public constant VAMPURRFANG = 7;*/

    //ipfs gateway + folder where nft are saved. Used to return the uri of the asset saved on the ipfs
    string public IPFS_GATEWAY = "https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmZofjbHRrXVisiCPqM3R6p7fnwT7nTXcDKMLAxUC8eWq4/";

    //useless now beacuse every available asset is mapped on assets mapping
    //uint256[] public listIds = [SKELECAT, COSMOSQUIT, TECHNOTOK, ARTHURKING, SPARTANWHISKERS, PUMPKINPURR, VAMPURRFANG]; //indexes of collections 
    
    //this mapping is used to store the information about the available assets. If an asset is not available, it could be saved with amount 0 in deploy phase.
    //the flag parameter is used to distinguish between existing nfts [id 1-7] and all the other possible value that could be given as input. 
    mapping(uint256 => Asset) public assets;

    struct Asset{
        uint256 id;
        uint256 price;
        uint256 amount;
        uint8 flag;
    }

    constructor(uint256[] memory ids, uint256[] memory amounts, uint256[] memory prices) 
        ERC1155("https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmZofjbHRrXVisiCPqM3R6p7fnwT7nTXcDKMLAxUC8eWq4/{id}.json")
        Ownable(msg.sender)
    {   
        require(ids.length == amounts.length, "Given arrays of ids and amounts of different lengths");
        require(ids.length == prices.length, "Given arrays of ids and prices of different lengths");
        _mintBatch(msg.sender, ids, amounts, "0x00");
        for(uint i = 0; i < ids.length; i++){
            assets[ids[i]] = Asset(ids[i], amounts[i], prices[i], 1);
        }
    }

    function mintBatch(uint256[] memory ids, uint256[] memory amounts,bytes memory data) public onlyOwner {
        for(uint i = 0; i < ids.length; i++) {
            require(assets[ids[i]].flag == 1, "Not existing asset"); // check su tutti gli id 
        }
        _mintBatch(msg.sender, ids, amounts, data);
    }

    function mint(uint256 tokenId, uint256 amount, bytes memory data) public onlyOwner {
        require(assets[tokenId].flag == 1, "Not existing asset"); // Controlla se l'ID è valido
    
        _mint(msg.sender, tokenId, amount, data);
    }

    /*function getIds() internal view returns(uint256[] memory){
        return listIds;
    }*/

    function getAsset(uint256 _tokenId) public view returns (string memory, uint256, uint256){
        require(assets[_tokenId].flag == 1, "this token doesn't exist");
        string memory uri = string(
            abi.encodePacked(
                IPFS_GATEWAY,
                Strings.toString(_tokenId),
                ".json"
            )
        );
        return (uri, assets[_tokenId].amount, assets[_tokenId].price);
    }

    

    function safeTransferFrom(uint256 tokenId, uint256 amount, address to) public payable {
        require(assets[tokenId].flag == 1, "Not existing token");
        require(assets[tokenId].amount >= amount, "Not enough available amount of token");
        require(assets[tokenId].price * amount  <= msg.value, "unsufficient transferred value");

        _safeTransferFrom(owner(), to, tokenId, amount, "0x00");

        assets[tokenId].amount -= amount; 
    }

    function safeBatchTransferFrom(address to, uint256[] memory ids, uint256[] memory amounts) public payable {
        require(ids.length == amounts.length, "Given arrays of ids and amounts of different lengths");

        uint256 total_cost = 0;
        for(uint i = 0; i < ids.length; i++) {
            require(assets[ids[i]].flag == 1, "Not existing asset"); // check su tutti gli id 
            require(assets[ids[i]].amount >= amounts[i], "Not enough available amount of token");
            total_cost += assets[ids[i]].price * amounts[i];
        }

        require(total_cost  <= msg.value, "unsufficient transferred value");
        
        for(uint i = 0; i < ids.length; i++) {
            assets[ids[i]].amount -= amounts[i];
        }

        _safeBatchTransferFrom(owner(), to, ids, amounts, "0x00");
    }
    
    
}