import { SetStateAction, useState } from "react";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

export const NFTCard = ({ nft, contract, refreshNFTs }: any) => {
  const [transferToAddress, setTransferToAddress] = useState("");
  const [processing, setProcessing] = useState("");

  const handleTransfer = async () => {
    if (!contract) {
      setProcessing("Contract not connected!");
      return;
    }
  
    if (!transferToAddress) {
      setProcessing("Enter a valid recipient address!");
      return;
    }
  
    try {
      setProcessing("Transferring NFT...");
  
      // ✅ Use signer when calling contract functions
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
  
      // ✅ Send Transaction
      const tx = await contractWithSigner.transfer(nft.id, transferToAddress);
      await tx.wait(); // ✅ Wait for confirmation
  
      setProcessing("✅ Transfer Successful!");
      setTransferToAddress(""); // Reset input field
  
      // ✅ Refresh NFTs after transfer
      refreshNFTs();
    } catch (error) {
      console.error("Transfer failed:", error);
      setProcessing("❌ Transfer Failed!");
    }
  };

  return (
    <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
      <figure className="relative">
        <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
        <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
          <span className="text-white "># {nft.id}</span>
        </figcaption>
      </figure>
      <div className="card-body space-y-3">
        <div className="flex items-center justify-center">
          <p className="text-xl p-0 m-0 font-semibold">{nft.name}</p>
          <div className="flex flex-wrap space-x-2 mt-1">
            {nft.attributes?.map((attr: any, index: any) => (
              <span key={index} className="badge badge-primary py-3">
                {attr.value}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center mt-1">
          <p className="my-0 text-lg">{nft.description}</p>
        </div>
        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Owner: </span>
          <Address address={nft.owner} />
        </div>
        <div className="flex flex-col my-2 space-y-1">
          <span className="text-lg font-semibold mb-1">Transfer To: </span>
          <AddressInput
            value={transferToAddress}
            placeholder="Receiver address"
            onChange={(newValue: SetStateAction<string>) =>
              setTransferToAddress(newValue)
            }
          />
        </div>
        <div className="text-center text-primary">{processing}</div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary btn-md px-8 tracking-wide"
            onClick={handleTransfer}
            disabled={processing === "⏳ Transferring NFT..."}
          >
            {processing || "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
