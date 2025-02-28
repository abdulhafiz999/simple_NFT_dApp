// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HackerBoostPunksModule", (m) => {
  const baseURI = "ipfs://bafybeiewvbpr76hwencf3ymwu7muyh3kzim6uiioapvmuou4xe3h5j4njm/";
  

  const hackerBoostPunks = m.contract("HackerBoostPunks", [baseURI]);

  return { hackerBoostPunks };
});

