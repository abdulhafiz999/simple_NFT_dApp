// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Strings.sol";
contract HackerBoostPunks {
    // 1. Storage for NFT metadata
    string private _baseTokenURI;

    // 2. NFT data tracking
    uint256 public tokenId;
    uint256 public maxTokensIds = 10;
    uint256 public price = 0.001 ether;
    bool public paused;

    // 3. Mapping to track owners and token existence
    mapping(uint256 => address) public tokenOwners;
    mapping(address => uint256[]) public ownedTokens;

    // 4. Owner of the contrac
    address public owner;

    // 8. Event for Minting NFTs

    event Minted(address indexed owner, uint256 indexed tokenId);

    // 10. Event for NFT Transfers
    event Transferred(
        address indexed from,
        address indexed receiver,
        uint256 indexed tokenId
    );

    // 5. Constructor to set contract ownership and base URI
    constructor(string memory baseURI) {
        owner = msg.sender;
        _baseTokenURI = baseURI;
    }

    // 7. Modifiers for access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is currently paused");
        _;
    }

    // 6. Function to handle token minting
    function mint() public payable {
        require(tokenId < maxTokensIds, "Max supply reached");
        require(msg.value >= price, "Insufficient Ether");

        tokenId++;

        tokenOwners[tokenId] = msg.sender;
        ownedTokens[msg.sender].push(tokenId);

        emit Minted(msg.sender, tokenId);
    }

    // 9. Function to transfer NFT ownership
    function transfer(uint256 _tokenId, address receiver) public {
        require(tokenOwners[_tokenId] == msg.sender, "Not the token owner");
        require(receiver != address(0), "Invalid recipient address");

        tokenOwners[_tokenId] = receiver;

        uint256[] storage senderTokens = ownedTokens[msg.sender];
        for (uint256 i = 0; i < senderTokens.length; i++) {
            if (senderTokens[i] == _tokenId) {
                senderTokens[i] = senderTokens[senderTokens.length - 1];
                senderTokens.pop();
                break;
            }
        }
        ownedTokens[receiver].push(_tokenId);

        emit Transferred(msg.sender, receiver, _tokenId);
    }

    // 11. Function to check balance (number of NFTs owned)
    function balanceOf(address _owner) public view returns (uint256) {
        return ownedTokens[_owner].length;
    }

    // 12. Function to get token ID by index
    function tokenOfOwnerByIndex(
        address _owner,
        uint256 index
    ) public view returns (uint256) {
        require(index < ownedTokens[_owner].length, "Invalid index");
        return ownedTokens[_owner][index];
    }

    // 13. Function to retrieve token metadata
    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        require(tokenOwners[_tokenId] != address(0), "Token does not exist");
        return
            string(
                abi.encodePacked(
                    _baseTokenURI,
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }
    // 14. Function to withdraw contract balance
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(success, "Withdrawal failed");
    }

    // 15. Allow the contract to receive Ether
}
