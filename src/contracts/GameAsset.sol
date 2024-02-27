// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameAsset is ERC1155{
    uint256 public constant SKELECAT = 1;
    uint256 public constant COSMOSQUIT = 2;
    uint256 public constant TECHNOTOK = 3;

    uint256[] listIds = [SKELECAT,COSMOSQUIT,TECHNOTOK];

    constructor() ERC1155("https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmUftc8LtmFfdcQrm3iNtVwHahay18V8CntcpmHeeskPJ9/{id}.json"){
    }

    function createToken (address account,uint256[] memory ids,uint256[] memory amounts,bytes memory data) public {
        ids = listIds;
        _mintBatch(account, ids, amounts, data);
    }

    function getIds() public view returns(uint256[] memory){
        return listIds;
    }

    function uri(uint256 _tokenId) override public pure returns (string memory){
        return string(
            abi.encodePacked(
                "https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmUftc8LtmFfdcQrm3iNtVwHahay18V8CntcpmHeeskPJ9/",
                Strings.toString(_tokenId),
                ".json"
            )
        );
    }
}
