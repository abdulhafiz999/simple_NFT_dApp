require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {providerApiKey, deployerPrivateKey} = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
  }
};
