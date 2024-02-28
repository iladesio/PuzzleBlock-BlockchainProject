// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameAsset is ERC1155, Ownable{
    uint256 public constant SKELECAT = 1;
    uint256 public constant COSMOSQUIT = 2;
    uint256 public constant TECHNOTOK = 3;
    uint256 public constant ARTHURKING = 4;
    uint256 public constant SPARTANWHISKERS = 5;
    uint256 public constant PUMPKINPURR = 6;
    uint256 public constant VAMPURRFANG = 7;
    
    uint256[] public listIds = [SKELECAT, COSMOSQUIT, TECHNOTOK, ARTHURKING, SPARTANWHISKERS, PUMPKINPURR, VAMPURRFANG]; //indexes of collections 
    
    uint256[] private amounts;
    mapping(uint256 => Asset) public assets;

    struct Asset{
        uint256 id;
        uint8 rarity;
    }

    struct Rarity{
        uint8 id;
        uint256 price;
        uint256 amount;
    }

    mapping(uint8 => Rarity) public rarityMapping;

    constructor() 
        ERC1155("https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmZofjbHRrXVisiCPqM3R6p7fnwT7nTXcDKMLAxUC8eWq4/{id}.json")
        Ownable(msg.sender)
    {   
        //uncommon 
        rarityMapping[1].price = 100;
        rarityMapping[1].amount = 1000;

        //a bit rare
        rarityMapping[2].price = 150;
        rarityMapping[2].amount = 800;

        //rare
        rarityMapping[3].price = 250;
        rarityMapping[3].amount = 500;

        //mythic
        rarityMapping[1].price = 550;
        rarityMapping[1].amount = 100;

        for(uint i = 0; i < listIds.length; i++) {
            // Inizializza con l'amount e il prezzo attribuito ad una certa rarity
            amounts[i] = rarityMapping[assets[i].rarity].amount;
        }

        _mintBatch(msg.sender, listIds, amounts, "0x00");
    }

    function mintBatch(uint256[] memory ids, uint256[] memory _amounts,bytes memory data) public onlyOwner {
        for(uint i = 0; i < listIds.length; i++) {
            require(ids[i] < listIds.length, "ID non valido"); // check su tutti gli id 
        }
        _mintBatch(msg.sender, listIds, _amounts, data);
    }

    function mint(uint256 tokenId, uint256 amount, bytes memory data) public onlyOwner {
        require(tokenId <= listIds.length, "ID non valido"); // Controlla se l'ID è valido
        require(rarityMapping[assets[tokenId].rarity].amount >= amount, "Amount non sufficiente");
        
        _mint(msg.sender, tokenId, amount, data);
    }

    function getIds() internal view returns(uint256[] memory){
        return listIds;
    }

    function uri(uint256 _tokenId) override public pure returns (string memory){
        return string(
            abi.encodePacked(
                "https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmZofjbHRrXVisiCPqM3R6p7fnwT7nTXcDKMLAxUC8eWq4/",
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }

    function safeTransferFrom(uint256 tokenId, uint256 amount, address to) public payable {
        require(msg.value >= rarityMapping[assets[tokenId].rarity].price, "Unsufficient transferred value" );
        require(rarityMapping[assets[tokenId].rarity].amount >= amount," Not sufficient amount of this asset" );

        rarityMapping[assets[tokenId].rarity].amount -= amount;

        _safeTransferFrom(msg.sender, to, tokenId, amount, "0x00");
    }

    function safeBatchTransferFrom(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) public {
        _safeBatchTransferFrom(msg.sender, to, ids, values, data);
    }
    
    function setPrice(uint256 tokenId,uint256 newPrice)public onlyOwner{
        require(tokenId <= listIds.length, "ID non valido"); // Controlla se l'ID è valido
        
        rarityMapping[assets[tokenId].rarity].price = newPrice;
    }
}

