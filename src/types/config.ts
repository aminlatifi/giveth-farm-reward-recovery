export interface UnipoolConfig {
  name: string;
  unipoolAddress: string;
}

export interface Config {
  [network: string]: {
    subgraphApi: string;
    blocknumber: number;
    timestamp: number;
    unipoolConfigs: UnipoolConfig[];
  };
}
