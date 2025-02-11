// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Strings.sol";

contract HackerBoostPunks {
    using Strings for uint256;

    // Storage for NFT metadata
    string private _baseTokenURI;

    // NFT data tracking
    uint256 public totalSupply;
    uint256 public maxTokensIds = 10;
    uint256 public price = 0.01 ether;
    bool public paused;

    // Mapping to track owners and token existence
    mapping(uint256 => address) public tokenOwners;
    mapping(address => uint256[]) public ownedTokens;

    // Owner of the contract
    address public owner;

    // ✅ Event for Minting NFTs
    event Minted(address indexed owner, uint256 indexed tokenId);

    // ✅ Event for NFT Transfers
    event Transferred(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // Constructor to set contract ownership and base URI
    constructor(string memory baseURI) {
        owner = msg.sender;
        _baseTokenURI = baseURI;
    }

    // Modifiers for access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is currently paused");
        _;
    }

    // Function to handle token minting
    function mint() public payable whenNotPaused {
        require(totalSupply < maxTokensIds, "Max supply reached");
        require(msg.value >= price, "Insufficient Ether");

        // Increase the total supply
        totalSupply++;

        // Assign token to minter
        tokenOwners[totalSupply] = msg.sender;
        ownedTokens[msg.sender].push(totalSupply);

        emit Minted(msg.sender, totalSupply);
    }

    // Function to transfer NFT ownership
    function transfer(uint256 tokenId, address to) public {
        require(tokenOwners[tokenId] == msg.sender, "Not the token owner");
        require(to != address(0), "Invalid recipient address");

        tokenOwners[tokenId] = to;

        // Remove token from sender's list
        uint256[] storage senderTokens = ownedTokens[msg.sender];
        for (uint256 i = 0; i < senderTokens.length; i++) {
            if (senderTokens[i] == tokenId) {
                senderTokens[i] = senderTokens[senderTokens.length - 1];
                senderTokens.pop();
                break;
            }
        }

        // Add token to recipient's list
        ownedTokens[to].push(tokenId);

        emit Transferred(msg.sender, to, tokenId);
    }

    // Function to check balance (number of NFTs owned)
    function balanceOf(address _owner) public view returns (uint256) {
        return ownedTokens[_owner].length;
    }

    // ✅ FIXED Function to get token ID by index
    function tokenOfOwnerByIndex(
        address _owner,
        uint256 index
    ) public view returns (uint256) {
        require(index < ownedTokens[_owner].length, "Invalid index");
        return ownedTokens[_owner][index]; // ✅ Fixed
    }

    // Function to retrieve token metadata
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenOwners[tokenId] != address(0), "Token does not exist");
        return
            string(
                abi.encodePacked(
                    _baseTokenURI,
                    Strings.toString(tokenId),
                    ".json"
                )
            );
    }

    // Function to withdraw contract balance
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(success, "Withdrawal failed");
    }

    // Allow the contract to receive Ether
    receive() external payable {}

    fallback() external payable {}
}
