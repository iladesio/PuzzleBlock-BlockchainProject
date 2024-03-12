// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IPuzzleContract {
    function editUser(address _userAddress, string memory _ipfsCid) external;
}

contract GameAsset is ERC1155, Ownable{

    // Ipfs gateway + folder where NFTs json are saved. Used to return the uri of the asset saved on the ipfs
    string public IPFS_GATEWAY = "https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmYgKt3yMV3yWyYNVpYGeoVczTQLVhVb9gi4EaG76cVWwg/";
    
    // This mapping is used to store the information about the available assets. If an asset is not available, it could be saved with amount 0 in deploy phase.
    // The isMinted parameter is used to distinguish between existing NFTs [id 1-7] and all the other possible value that could be given as input. 
    mapping(uint256 => Asset) public assets;

    uint256[] id_assets;

    // Struct defining a collection with its ID, price, available amount, and a isMinted to indicate its existence.
    struct Asset{
        uint256 id;
        uint16 price;
        uint256 amount;
        uint256 releaseDate;
        bool isMinted;
    }

    IPuzzleContract puzzleContract;

    /* Constructor to initialize the contract with predefined assets.
        @param ids: Array of asset IDs.
        @param amounts: Array of amounts for each asset.
        @param prices: Array of prices for each asset.
        Requires that ids, amounts, and prices arrays are of the same length. 
    */
    constructor(uint256[] memory ids, uint256[] memory amounts, uint16[] memory prices, address _puzzleContractAddress) 
        ERC1155("https://bronze-personal-meadowlark-873.mypinata.cloud/ipfs/QmYgKt3yMV3yWyYNVpYGeoVczTQLVhVb9gi4EaG76cVWwg/{id}.json")
        Ownable(msg.sender)
    {   
        require(ids.length == amounts.length, "Given arrays of ids and amounts of different lengths");
        require(ids.length == prices.length, "Given arrays of ids and prices of different lengths");
        _mintBatch(msg.sender, ids, amounts, "0x00");
        for(uint i = 0; i < ids.length; i++){
            assets[ids[i]] = Asset(ids[i], prices[i], amounts[i], block.timestamp, true);
            id_assets.push(ids[i]);
        }

        puzzleContract = IPuzzleContract(_puzzleContractAddress);
    }

    /* Function overrided to mint a batch of assets.
        @param ids: Array of asset IDs to mint.
        @param amounts: Array of amounts for each asset.
        @param data: Additional data with no specified format, sent in call to '_mintBatch'.
        Requires that each asset ID exists in the `assets` mapping.
    */
    function mintBatch(uint256[] memory ids, uint256[] memory amounts,bytes memory data) public onlyOwner {
        for(uint i = 0; i < ids.length; i++) {
            require(assets[ids[i]].isMinted, "Not existing asset"); // check su tutti gli id 
        }

        _mintBatch(msg.sender, ids, amounts, data);

        for(uint i = 0; i < ids.length; i++) {
            assets[ids[i]].releaseDate = block.timestamp;
            assets[ids[i]].amount += amounts[i]; 
        }
    }

    /* Function overrided to mint a single asset.
        @param tokenId: ID of the asset to mint.
        @param amount: Amount of the asset to mint.
        @param data: Additional data with no specified format, sent in call to '_mint'.
        Requires that each asset ID exists in the 'assets' mapping.
    */
    function mint(uint256 tokenId, uint256 amount, bytes memory data) public onlyOwner {
        require(assets[tokenId].isMinted, "Not existing asset"); // Controlla se l'ID è valido
    
        _mint(msg.sender, tokenId, amount, data);

        assets[tokenId].releaseDate = block.timestamp;
        assets[tokenId].amount += amount;

    }

    /* Function to get the URI, amount, and price of an asset by its token ID.
        @param _tokenId ID of the asset to query.
        @return URI of the asset, amount available, its price and the release date.
        Requires that the asset exists.
    */
    function getAsset(uint256 _tokenId) public view returns (string memory, uint256, uint16, uint256){
        require(assets[_tokenId].isMinted, "this token doesn't exist");
        string memory uri = string(
            abi.encodePacked(
                IPFS_GATEWAY,
                Strings.toString(_tokenId),
                ".json"
            )
        );
        return (uri, assets[_tokenId].amount, assets[_tokenId].price, assets[_tokenId].releaseDate);
    }

    /* Function to get the list of existing asset ids.
        @return list of ids
    */
    function getAssets() public view returns (uint256[] memory ids){
        return (id_assets);
    }

    /* Function overrided to safely transfer a specific amount of an asset to a given address.
        @param tokenId: ID of the asset to transfer.
        @param amount: Amount of the asset to transfer.
        @param to: Address to transfer the asset to.
        @param ipfsCid: CID of the ipfs for the edit user. 
        Requires that the asset exists, the amount is available, and the transferred value is sufficient.
    */
    function safeTransferFromTo(uint256 tokenId, uint256 amount, address to, string memory ipfsCid) public payable {
        require(assets[tokenId].isMinted, "Not existing token");
        require(assets[tokenId].amount >= amount, "Not enough available amount of token");
        //require(assets[tokenId].price * amount  <= msg.value, "unsufficient transferred value");

        _safeTransferFrom(owner(), to, tokenId, amount, "0x00");
        
        assets[tokenId].amount -= amount; 

        puzzleContract.editUser(to,ipfsCid);
    }

    /* Function overrided to safely transfer specific amounts of multiple assets to a given address.
        @param to Address to transfer the assets to.
        @param ids Array of asset IDs to transfer.
        @param amounts Array of amounts for each asset.
        Requires that each asset ID exists, the amount for each is available, and the total transferred value is sufficient.
    */
    function safeBatchTransferFrom(address to, uint256[] memory ids, uint256[] memory amounts, string memory ipfsCid) public payable {
        for(uint i = 0; i < ids.length; i++) {
            assets[ids[i]].amount -= amounts[i];
        }

        _safeBatchTransferFrom(owner(), to, ids, amounts, "0x00");

        puzzleContract.editUser(to, ipfsCid);
    }
    
    /* Function to retrieve the total costs of a set or single asset.
        @param ids Array of asset IDs to transfer.
        @param amounts Array of amounts for each asset.
        returns the uint256 of total costs.
    */
    function getCost(uint256[] memory ids, uint256[] memory amounts) public view returns (uint256 total_cost) {
        require(ids.length == amounts.length, "Given arrays of ids and amounts of different lengths");

        total_cost = 0;

        for(uint i = 0; i < ids.length; i++) {
            require(assets[ids[i]].isMinted, "Not existing asset"); // check su tutti gli id 
            require(assets[ids[i]].amount >= amounts[i], "Not enough available amount of token");
            total_cost += assets[ids[i]].price * amounts[i];
        }

        return total_cost;
    }
    
}