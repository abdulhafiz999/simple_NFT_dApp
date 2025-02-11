"use client";
import React, { useEffect, useState } from "react";
import { MyHoldings } from "./MyHoldings";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "../components/RainbowKitCustomConnectButton";
import { ethers } from "ethers";

import CONTRACT_ABI from "../../../artifacts/contracts/HackerBoostPunks.sol/HackerBoostPunks.json";

import contractAddresses from "../../contractAddress.json";

const NETWORK = "sepolia"; // Change to network accordingly
const CONTRACT_ADDRESS = contractAddresses.Arbitrum[NETWORK];

function Page() {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const [myAllCollectibles, setMyAllCollectibles] = useState<
    { id: string; tokenURI: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!connectedAddress) return;
    fetchNFTs();
    setupEventListener();
  }, [connectedAddress]); // ✅ Runs only when wallet connects

  const fetchNFTs = async () => {
    if (!connectedAddress) return;

    setLoading(true);
    setError(null);

    try {
      // ✅ Connect to Ethereum Provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI.abi,
        provider
      );
      setContract(nftContract); // ✅ Store contract for later use

      // ✅ Get Number of NFTs Owned
      const balance = await nftContract?.balanceOf(connectedAddress);
      if (balance.toString() === "0") {
        setMyAllCollectibles([]); // No NFTs
        setLoading(false);
        return;
      }

      // ✅ Fetch Token IDs & Metadata
      const nftPromises = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract?.tokenOfOwnerByIndex(
          connectedAddress,
          i
        );
        let tokenURI = await nftContract?.tokenURI(tokenId);

        // ✅ Convert IPFS URL to HTTP Gateway
        if (tokenURI?.startsWith("ipfs://")) {
          tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        // ✅ Fetch Metadata from IPFS
        const metadataResponse = await fetch(tokenURI);
        const metadata = await metadataResponse.json();

        nftPromises.push({
          id: tokenId.toString(),
          owner: connectedAddress,
          tokenURI: tokenURI,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.startsWith("ipfs://")
            ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            : metadata.image,
        });
      }

      setMyAllCollectibles(await Promise.all(nftPromises));
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs.");
    } finally {
      setLoading(false);
    }
  };

  const setupEventListener = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const nftContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI.abi,
      provider
    );

    // ✅ Listen for the `Minted` event emitted by the mint function
    nftContract.on("Minted", (owner, tokenId) => {
      if (owner.toLowerCase() === connectedAddress?.toLowerCase()) {
        console.log(`New NFT Minted! Token ID: ${tokenId}`);
        fetchNFTs(); // ✅ Fetch updated NFTs when a new one is minted
      }
    });

    console.log("Listening for NFT minting events...");
  };

  const handleMintItem = async () => {
    try {
      if (!window.ethereum) throw new Error("No Ethereum provider found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // ✅ Get the signer

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI.abi,
        signer // ✅ Use the signer
      );

      const tx = await nftContract.mint({ value: ethers.parseEther("0.01") });
      console.log("Minting in progress...");
      await tx.wait();

      console.log("Minting successful! Fetching updated NFTs...");
      fetchNFTs(); // ✅ Fetch NFTs immediately after minting
    } catch (error) {
      console.error("Minting failed:", error);
      alert(
        "Minting failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My NFTs</span>
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        {!isConnected ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handleMintItem}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Mint NFT"}
          </button>
        )}
      </div>
      <MyHoldings
        myAllCollectibles={myAllCollectibles}
        isConnected={isConnected}
        loading={loading}
        error={error}
        contract={contract}
        refreshNFTs={fetchNFTs}
      />
    </>
  );
}

export default Page;
