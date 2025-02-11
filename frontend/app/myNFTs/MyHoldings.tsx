"use client";

import { useEffect } from "react";
import { NFTCard } from "./NFTCard";

export const MyHoldings = ({
  myAllCollectibles,
  isConnected,
  loading,
  error,
  contract,
  refreshNFTs,
}: any) => {

  useEffect(() => {
    if (!isConnected) return;
    refreshNFTs();
  }, [isConnected]); // ✅ Refreshes when minting is done
  

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="text-2xl text-primary-content">
          Connect your wallet to see your NFTs
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="text-2xl text-error">{error}</div>
      </div>
    );
  }

  return (
    <>
      {myAllCollectibles.length === 0 ? (
        <div className="flex justify-center items-center mt-10">
          <div className="text-2xl text-primary-content">No NFTs found</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
          {myAllCollectibles.map((item: any) => (
            <NFTCard 
              nft={item} 
              key={item.id} 
              contract={contract} 
              refreshNFTs={refreshNFTs}
            />
          ))}
        </div>
      )}
    </>
  );
};
