// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameAsset is ERC1155, Ownable{
    uint256[] public listIds = [1, 2, 3, 4, 5, 6, 7]; //indexes of collections 
    uint256[] amounts = [20, 20, 20, 20, 20, 20, 20];
    //uint256[] values = [100,150,200];
    
    constructor() 
        ERC1155("https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmZofjbHRrXVisiCPqM3R6p7fnwT7nTXcDKMLAxUC8eWq4/{id}.json")
        Ownable(msg.sender)
    {}

    function mintBatch (bytes memory data) public onlyOwner {
        _mintBatch(msg.sender, listIds, amounts, data);
    }

    function mint(uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(msg.sender, id, amount, data);
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

    function safeTransferFrom(uint256 tokenId, uint256 amount, address to) public {
        _safeTransferFrom(msg.sender, to, tokenId, amount, "0x00");
    }

    function safeBatchTransferFrom(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) public {
        _safeBatchTransferFrom(msg.sender, to, ids, values, data);
    }
    
}