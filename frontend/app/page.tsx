"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "./utils/hackerboost-eth/Address/Address";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">HackerBoost Punks</span>
            <span className="block text-xl font-bold">
              (An NFT collection for HackerBoost members)
            </span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <div className="flex items-center flex-col flex-grow mt-4">
            <div className="px-5 w-[90%]">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/hack2.png"
                  width="727"
                  height="231"
                  alt="challenge banner"
                  className="rounded-full h-[400px] w-[400px] border-4 border-primary"
                />
                <div className="max-w-3xl mt-20">
                  <h2 className="text-secondary">What you'll learn:</h2>
                  <ul className="space-y-4 list-decimal ml-8">
                    <li>
                      {" "}
                      How to use{" "}
                      <a
                        href="https://hardhat.org/getting-started/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        HardHat
                      </a>{" "}
                      to compile and deploy smart contracts.
                    </li>
                    <li>
                      Use a NextJs template with some important Ethereum
                      components and hooks to build your frontend.
                    </li>
                    <li>
                      Finally, how to deploy an NFT DApp to a public network to
                      share and share with your friends!
                    </li>
                  </ul>
                  <p className="text-left text-lg">
                    The final deliverable is an app that lets mmebers purchase
                    and transfer NFTs. Deploy your contracts to a testnet then
                    build and upload your app to a public web server. !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
