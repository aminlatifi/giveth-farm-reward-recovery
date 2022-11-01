import { Config } from './types/config';

export const config: Config = {
  mainnet: {
    subgraphApi:
      'https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-second-mainnet',
    blocknumber: 15854468,
    timestamp: 1667055635,
    unipoolConfigs: [
      {
        name: 'GIV-ETH-balancer',
        unipoolAddress: '0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1',
      },
      {
        name: 'GIV-100%',
        unipoolAddress: '0x4B9EfAE862a1755F7CEcb021856D467E86976755',
      },
      {
        name: 'ICHI',
        unipoolAddress: '0xA4b727DF6fD608d1835e3440288c73fB28c4eF16',
      },
      {
        name: 'CULT-ETH-Regen-Farm',
        unipoolAddress: '0xa479103c2618aD514653B53F064Bc6c9dC35a30b',
      },
    ],
  },
};
