# **🚀 HackerBoostPunks NFT DApp - Step-by-Step Tutorial**
This tutorial will guide you through **building a simple NFT contract** from scratch. You will **clone the repository** and progressively copy and paste code **from this guide** while understanding each step.

---

## **📌 Step 1: Define Storage for NFT Metadata**
NFTs need metadata (name, image, description, etc.). We store the **base URI** for metadata.

```solidity
// 1️⃣ Storage for NFT metadata
string private _baseTokenURI;
```
🔹 **Explanation:**  
- `_baseTokenURI` will store the base URL where the NFT metadata (JSON files) are stored (e.g., IPFS or Arweave).

---

## **📌 Step 2: Track NFTs with Counters**
We need to track **total supply**, **maximum NFTs**, and **price per NFT**.

```solidity
// 2️⃣ NFT data tracking
uint256 public totalSupply;
uint256 public maxTokensIds = 10;
uint256 public price = 0.01 ether;
bool public paused;
```
🔹 **Explanation:**  
- `totalSupply` → Keeps track of how many NFTs have been minted.  
- `maxTokensIds` → Limits the number of NFTs that can be minted.  
- `price` → Defines the minting cost per NFT.  
- `paused` → Used to **pause** the contract if needed.

---

## **📌 Step 3: Mapping to Track Ownership**
We need mappings to **assign token IDs to owners**.

```solidity
// 3️⃣ Mapping to track owners and token existence
mapping(uint256 => address) public tokenOwners;
mapping(address => uint256[]) public ownedTokens;
```
🔹 **Explanation:**  
- `tokenOwners` → Maps **token ID** to **owner address**.  
- `ownedTokens` → Maps **owner address** to **an array of token IDs they own**.

---

## **📌 Step 4: Define Contract Owner**
The contract should have an **owner** with special privileges.

```solidity
// 4️⃣ Owner of the contract
address public owner;
```
🔹 **Explanation:**  
- `owner` → Stores the Ethereum address of the contract owner.

---

## **📌 Step 5: Constructor to Set Ownership and Base URI**
We initialize the contract during **deployment**.

```solidity
// 5️⃣ Constructor to set contract ownership and base URI
constructor(string memory baseURI) {
    owner = msg.sender;
    _baseTokenURI = baseURI;
}
```
🔹 **Explanation:**  
- The `constructor` sets the **owner** and the **base URI for metadata**.

---

## **📌 Step 6: Modifiers for Access Control**
Modifiers restrict access to **only the owner** or **when the contract is not paused**.

```solidity
// 6️⃣ Modifiers for access control
modifier onlyOwner() {
    require(msg.sender == owner, "Not contract owner");
    _;
}

modifier whenNotPaused() {
    require(!paused, "Contract is currently paused");
    _;
}
```
🔹 **Explanation:**  
- `onlyOwner` → Restricts certain functions **only to the contract owner**.  
- `whenNotPaused` → Prevents **minting while the contract is paused**.

---

## **📌 Step 7: Minting Function**
Users should be able to **mint an NFT** by paying **Ether**.

```solidity
// 7️⃣ Function to handle token minting
function mint() public payable whenNotPaused {
    require(totalSupply < maxTokensIds, "Max supply reached");
    require(msg.value >= price, "Insufficient Ether");

    totalSupply++;

    tokenOwners[totalSupply] = msg.sender;
    ownedTokens[msg.sender].push(totalSupply);

    emit Minted(msg.sender, totalSupply);
}
```
🔹 **Explanation:**  
- Ensures **max supply is not exceeded**.  
- Ensures **users pay the correct amount**.  
- Assigns **new token ID** to the minter.  
- Updates **ownership mapping**.  
- Emits a **Minted event**.

---

## **📌 Step 8: Minting Event**
Emit an event every time **an NFT is minted**.

```solidity
// 8️⃣ Event for Minting NFTs
event Minted(address indexed owner, uint256 indexed tokenId);
```
🔹 **Explanation:**  
- Events allow **frontends to listen for minting actions**.

---

## **📌 Step 9: NFT Transfer Function**
Owners should be able to **transfer** their NFTs.

```solidity
// 9️⃣ Function to transfer NFT ownership
function transfer(uint256 tokenId, address to) public {
    require(tokenOwners[tokenId] == msg.sender, "Not the token owner");
    require(to != address(0), "Invalid recipient address");

    tokenOwners[tokenId] = to;

    uint256[] storage senderTokens = ownedTokens[msg.sender];
    for (uint256 i = 0; i < senderTokens.length; i++) {
        if (senderTokens[i] == tokenId) {
            senderTokens[i] = senderTokens[senderTokens.length - 1];
            senderTokens.pop();
            break;
        }
    }
    ownedTokens[to].push(tokenId);

    emit Transferred(msg.sender, to, tokenId);
}
```
🔹 **Explanation:**  
- Checks that **only the owner** can transfer.  
- Updates **ownership mapping**.  
- Emits a **Transferred event**.

---

## **📌 Step 10: Transfer Event**
Emits an event when **an NFT is transferred**.

```solidity
// 10️⃣ Event for NFT Transfers
event Transferred(address indexed from, address indexed to, uint256 indexed tokenId);
```
🔹 **Explanation:**  
- Useful for tracking NFT transfers **on the blockchain**.

---

## **📌 Step 11: Checking NFT Balance**
Users should be able to **check how many NFTs they own**.

```solidity
// 11️⃣ Function to check balance (number of NFTs owned)
function balanceOf(address _owner) public view returns (uint256) {
    return ownedTokens[_owner].length;
}
```
🔹 **Explanation:**  
- Returns the **total number of NFTs owned** by a specific address.

---

## **📌 Step 12: Getting a Token ID by Index**
Retrieves **a token ID at a specific index**.

```solidity
// 12️⃣ Function to get token ID by index
function tokenOfOwnerByIndex(address _owner, uint256 index) public view returns (uint256) {
    require(index < ownedTokens[_owner].length, "Invalid index");
    return ownedTokens[_owner][index];
}
```
🔹 **Explanation:**  
- Allows **enumeration** of a user's **NFTs**.

---

## **📌 Step 13: Retrieving Metadata**
Retrieves **metadata URI** for an NFT.

```solidity
// 13️⃣ Function to retrieve token metadata
function tokenURI(uint256 tokenId) public view returns (string memory) {
    require(tokenOwners[tokenId] != address(0), "Token does not exist");
    return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
}
```
🔹 **Explanation:**  
- Returns **metadata URI** (e.g., IPFS link).

---

## **📌 Step 14: Withdraw Function**
The contract owner should be able to **withdraw funds**.

```solidity
// 14️⃣ Function to withdraw contract balance
function withdraw() public onlyOwner {
    (bool success, ) = payable(owner).call{value: address(this).balance}("");
    require(success, "Withdrawal failed");
}
```
🔹 **Explanation:**  
- Transfers **all Ether** in the contract to the owner.

---

## **📌 Step 15: Receiving Ether**
Allows the contract to **receive Ether**.

```solidity
// 15️⃣ Allow the contract to receive Ether
receive() external payable {}
fallback() external payable {}
```
🔹 **Explanation:**  
- Ensures the contract **does not reject incoming payments**.

---

### **🚀 Next Step**
📌 ## Deploy the contract 

📌 ## Copy Contract Address to Frontend
- Copy the contract address shown in the terminal.
- Paste it inside /frontend/contractAddress.json
This allows the frontend to interact with the deployed contract.


📌 ## Run the app in nft-project/frontend
-  Move into the frontend folder and install dependencies

```
cd ../frontend
npm install
```
npm run dev

📌 ## Test the app by minting and transfering NFTs between different addresses