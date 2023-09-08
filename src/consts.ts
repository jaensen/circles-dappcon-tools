export const AppMetadata = {
  name: "Mint HoG with Circles",
  icon: "'<svg></svg>'",
  logo: "https://circles.dappcon.io/images/dappconf-blue.png",
  description: "Exchange your Circles for HoG to buy DappCon tickets",
  explore: "https://circles.dappcon.io/",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
    { name: "Rabby", url: "https://rabby.io/" },
  ],
};
export const Chains = [{
  id: "0x64",
  rpcUrl: "https://rpc.circlesubi.id/",
  label: "Gnosis Chain",
  token: "xDai",
  publicRpcUrl: "https://rpc.circlesubi.id/",
  blockExplorerUrl: "https://gnosisscan.io/"
}];

export const CirclesGardenApi = `https://api.circles.garden/`;
export const CirclesSubgraphApi = `https://api.thegraph.com/subgraphs/name/circlesubi/circles-ubi`;
export const HubAddress = "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543";
export const CirclesUbiIdApi = "https://next.api.circlesubi.id/";
export const HoGTokenAddress = "0x6de572faa138048ce8142c4a206eb09a8ec39e45"
