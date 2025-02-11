// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HackerBoostPunksModule", (m) => {
  const baseURI = "ipfs://bafybeif274l5mhgdi6osmxrhbskxmxtnjq7ekhy2jawbsmpvctoua3zdb4/";

  const hackerBoostPunks = m.contract("HackerBoostPunks", [baseURI]);

  return { hackerBoostPunks };
});
