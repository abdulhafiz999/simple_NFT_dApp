# **HackerBoostPunks NFT DApp - Step-by-Step Tutorial**
This tutorial will guide you through **building a simple NFT contract** from scratch. You will **clone the repository** and progressively copy and paste code **from this guide** while understanding each step.

---

## Prerequisites

### Upload Images and Metadata to IPFS

First, we'll upload the images and metadata for our NFTs to IPFS using a service called Pinata.

1. **Sign Up on Pinata:**
   - Go to [Pinata](https://pinata.cloud/) and sign up for an account.

2. **Upload Images:**
      - Download the [HackerBoostPunks](https://res.cloudinary.com/hackerboost/raw/upload/v1726847922/hackerboostpunks_ltpsgd.zip) folder to your computer.
   - On the Pinata Dashboard, click on "Upload" and then select "Folder."
   - Upload the `HackerBoostPunks` folder and name it `HackerBoostPunks`.
   - After uploading, you’ll receive a CID (Content Identifier) for your folder.

3. **Verify Upload:**
   - To verify that the images are successfully uploaded, visit: `https://ipfs.io/ipfs/your-nft-folder-cid` (replace `your-nft-folder-cid` with your folder’s CID).

4. **Upload Metadata:**
   - Each NFT should have associated metadata stored in a JSON file. For example:
     ```json
     {
       "name": "1",
       "description": "NFT Collection for HackerBoost Members",
       "image": "ipfs://CID-OF-THE-HackerBoostPunks-Folder/1.png"
     }
     ```
   - Replace `"CID-OF-THE-HackerBoostPunks-Folder"` with the CID you received.

Now each NFT's metadata has been uploaded to IPFS and pinata should have generated a CID for your metadata folder
   - We have pre-generated files for metadata for you, you can download them to your computer by clicking [HERE](https://res.cloudinary.com/hackerboost/raw/upload/v1739572956/punksmetadata_gxysku.zip) and upload this metadata folder to pinata.
5. **Store Metadata CID:**
   - Once uploaded, copy the CID of the metadata folder and save it. You’ll need this later in the tutorial.

---

## BUILD

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
uint256 public tokenId;
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

    tokenId++;

    tokenOwners[tokenId] = msg.sender;
    ownedTokens[msg.sender].push(tokenId);

    emit Minted(msg.sender, tokenId);
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
event Transferred(address indexed from, address indexed receiver, uint256 indexed tokenId);
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
function tokenURI(uint256 _tokenId) public view returns (string memory) {
    require(tokenOwners[_tokenId] != address(0), "Token does not exist");
    return string(abi.encodePacked(_baseTokenURI, Strings.toString(_tokenId), ".json"));
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

## **Next Step**

### **Compile the Contract**   
📌 Compile the contract to check for errors:  
```sh
npx hardhat compile
```
---

### **Deploy the Contract**  
📌 Open `ignition/modules/deployHackerBoostPunks.js`.  
- Set the correct baseURL

📌 Open a new terminal and deploy the contract to arbitrum sepolia:  
```sh
npx hardhat ignition deploy "./ignition/modules/deployHackerStakingContract.ts" --network arbitrumSepolia
```
This will display the **contract address** in the terminal.

---

## Copy Contract Address to Frontend
- Copy the contract address shown in the terminal.
- Paste it inside /frontend/contractAddress.json
This allows the frontend to interact with the deployed contract.

---

## Run the app in nft-project/frontend
-  Move into the frontend folder and install dependencies
- The start the app in the development mode

```
cd ../frontend
npm install
npm run dev
```

## Test the DApp
📌 Open the browser and go to http://localhost:3000.
📌 Mint NFTs by clicking the "Mint NFT" button.
📌 Transfer NFTs between different accounts using MetaMask.


bafybeiewvbpr76hwencf3ymwu7muyh3kzim6uiioapvmuou4xe3h5j4njm

//0xaeB84d6129f4c4bA8bdd9256DF4fC8d3F4767242
