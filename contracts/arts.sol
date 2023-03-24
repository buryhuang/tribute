pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AIArtFractionalNFT is ERC721 {
    
    struct Artist {
        address artistAddress;
        uint256 ownershipPercentage;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => Artist[]) private artistList;
    mapping(uint256 => string) private imageHashList;
    mapping(address => uint256[]) private ownedTokens;

    uint256 private feePercentage = 5;
    address public contractOwner;

    event ArtMinted(uint256 indexed tokenId, string imageHash, address[] artistAddresses, uint256[] ownershipPercentages);
    event FeesDistributed(uint256 indexed tokenId, address[] artistAddresses, uint256[] distributedAmounts);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        contractOwner = msg.sender;
    }

    function mintAIArt(address[] memory artistAddresses, uint256[] memory ownershipPercentages, string memory imageHash) public payable {
        require(artistAddresses.length > 0, "At least one referenced artist address is required");
        require(artistAddresses.length == ownershipPercentages.length, "Artist addresses and ownership percentages length mismatch");
        require(msg.value > 0, "Fee required to mint AIArt");

        // Calculate total ownership percentage
        uint256 totalOwnershipPercentage;
        for(uint256 i = 0; i < ownershipPercentages.length; i++) {
            totalOwnershipPercentage += ownershipPercentages[i];
        }
        require(totalOwnershipPercentage == 100, "Total ownership percentage should be 100");

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter.increment();

        for(uint256 i = 0; i < artistAddresses.length; i++) {
            artistList[tokenId].push(Artist(artistAddresses[i], ownershipPercentages[i]));
        }
        imageHashList[tokenId] = imageHash;

        // Calculate and distribute fees
        uint256 fees = msg.value * feePercentage / 100;
        uint256 distributedFees;
        uint256[] memory distributedAmounts = new uint256[](artistAddresses.length);
        address[] memory distributedArtists = new address[](artistAddresses.length);

        for(uint256 i = 0; i < artistAddresses.length; i++) {
            uint256 artistFee = fees * ownershipPercentages[i] / 100;
            payable(artistAddresses[i]).transfer(artistFee);
            distributedFees += artistFee;
            distributedAmounts[i] = artistFee;
            distributedArtists[i] = artistAddresses[i];
        }

        payable(contractOwner).transfer(msg.value - distributedFees);

        emit ArtMinted(tokenId, imageHash, artistAddresses, ownershipPercentages);
        emit FeesDistributed(tokenId, distributedArtists, distributedAmounts);
    }

    function getArtistList(uint256 tokenId) public view returns (address[] memory) {
        Artist[] memory artists = artistList[tokenId];
        address[] memory artistAddresses = new address[](artists.length);

        for(uint256 i = 0; i < artists.length; i++) {
            artistAddresses[i] = artists[i].artistAddress;
        }

        return artistAddresses;
    }

    function getOwnershipPercentageList(uint256 tokenId) public view returns (uint256[] memory) {
        Artist[] memory artists = artistList[tokenId];
        uint256[] memory ownershipPercentages = new uint256[](artists.length);

        for(uint256 i = 0; i < artists.length; i++) {
            ownershipPercentages[i] = artists[i].ownershipPercentage;
        }

        return ownershipPercentages;
    }

    function getImageHash(uint256 tokenId) public view returns (string memory) {
        return imageHashList[tokenId];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        _updateOwnedTokens(from, to, tokenId);
    }

    function _updateOwnedTokens(address from, address to, uint256 tokenId) internal virtual {
        if(from != address(0)) {
            uint256[] storage fromTokenList = ownedTokens[from];
            for(uint256 i = 0; i < fromTokenList.length; i++) {
                if(fromTokenList[i] == tokenId) {
                    fromTokenList[i] = fromTokenList[fromTokenList.length - 1];
                    fromTokenList.pop();
                    break;
                }
            }
        }

        if(to != address(0)) {
            ownedTokens[to].push(tokenId);
        }
    }
}