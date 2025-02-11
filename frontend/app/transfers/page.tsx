"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Address } from "../components";
import { ethers } from "ethers";
import CONTRACT_ABI from "../../../artifacts/contracts/HackerBoostPunks.sol/HackerBoostPunks.json";

const CONTRACT_ADDRESS = "0xf200E2abC665b05b28291C044cB3930f39DacA4B"; // Replace with your contract address

const Transfers: NextPage = () => {
  const [transferEvents, setTransferEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log(transferEvents)

  useEffect(() => {
    fetchTransferEvents();
  }, []);

  const fetchTransferEvents = async () => {
    try {
      setIsLoading(true);

      // ✅ Connect to Ethereum Provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, provider);

      // ✅ Fetch past Transfer events
      const events = await contract.queryFilter("Transferred", 0, "latest");

      // ✅ Store event data
      setTransferEvents(events);
    } catch (error) {
      console.error("Error fetching transfer events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">All Transfers</span>
          </h1>
        </div>
        <div className="overflow-x-auto shadow-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-base-content">
                <th className="bg-primary">Token Id</th>
                <th className="bg-primary">From</th>
                <th className="bg-primary">To</th>
              </tr>
            </thead>
            <tbody>
              {transferEvents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No events found
                  </td>
                </tr>
              ) : (
                transferEvents.map((event, index) => (
                  <tr key={index}>
                    <th className="text-center">{event.args.tokenId.toString()}</th>
                    <td>
                      <Address address={event.args.from} />
                    </td>
                    <td>
                      <Address address={event.args.to} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Transfers;
