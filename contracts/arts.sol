// SPDX-License-Identifier: MIT

// Smart Contract for AI Generated Art

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IReferenceArtists {
    function getReferenceArtists(bytes memory _image) external view returns (address[] memory, uint256[] memory);
}

contract AIGeneratedArt is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public fee;
    address public referenceArtistsContract;

    struct Art {
        bytes image;
        address[] referencedArtists;
        uint256[] ownershipPercentages;
    }

    mapping (uint256 => Art) public arts;

    constructor(string memory _name, string memory _symbol, uint256 _fee, address _referenceArtistsContract) ERC721(_name, _symbol) {
        fee = _fee;
        referenceArtistsContract = _referenceArtistsContract;
    }

    function mint(bytes memory _image) external payable returns (uint256) {
        require(msg.value >= fee, "Insufficient fee");
        (address[] memory referencedArtists, uint256[] memory ownershipPercentages) = IReferenceArtists(referenceArtistsContract).getReferenceArtists(_image);
        require(referencedArtists.length > 0, "No referenced artists found");
        require(referencedArtists.length == ownershipPercentages.length, "Invalid ownership percentages");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        arts[tokenId] = Art(_image, referencedArtists, ownershipPercentages);

        uint256 distributedFees = 0;
        for (uint256 i = 0; i < referencedArtists.length; i++) {
            address artist = referencedArtists[i];
            uint256 percentage = ownershipPercentages[i];
            uint256 artistFee = (fee * percentage) / 100;
            payable(artist).transfer(artistFee);
            distributedFees += artistFee;
        }
        // if (distributedFees < fee) {
        //     payable(owner()).transfer(fee - distributedFees);
        // }

        return tokenId;
    }
}

contract ReferencedArtist is ERC721 {

    string public artistName;

    constructor(string memory _artistName, string memory _symbol) ERC721(_artistName, _symbol) {
        artistName = _artistName;
    }
}