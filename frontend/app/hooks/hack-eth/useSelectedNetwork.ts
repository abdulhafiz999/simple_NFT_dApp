import hackerboostConfig from "../../../hackerboost.config";
import { useGlobalState } from "../../services/store/store";
import { AllowedChainIds } from "../../utils/networks";

export function useSelectedNetwork(chainId?: AllowedChainIds) {
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  return hackerboostConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chainId) ?? targetNetwork;
}
