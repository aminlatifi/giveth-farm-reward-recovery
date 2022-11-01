import { config } from './config';
import { fetchUnipoolBalances, fetchUnipoolInfo } from '@/lib/subgraphHelper';
import { UnipoolHelper } from '@/lib/UnipoolHelper';
import { ethers } from 'ethers';
import { parse } from 'json2csv';
import fs from 'fs';

const main = async () => {
  for (const network of Object.keys(config)) {
    console.log('network: ', network);
    const networkConfig = config[network];
    const { subgraphApi, unipoolConfigs, blocknumber, timestamp } =
      networkConfig;

    for (const unipoolConfig of unipoolConfigs) {
      console.log('===> unipool: ', unipoolConfig.name);
      const [unipool, unipoolBalances] = await Promise.all([
        fetchUnipoolInfo(
          subgraphApi,
          unipoolConfig.unipoolAddress,
          blocknumber,
        ),
        fetchUnipoolBalances(
          subgraphApi,
          unipoolConfig.unipoolAddress,
          blocknumber,
        ),
      ]);

      const unipoolHelper = new UnipoolHelper(unipool, timestamp);

      fs.writeFileSync(
        `./output/${network}-${unipoolConfig.name}.csv`,
        parse(
          unipoolBalances.map((unipoolBalance) => {
            const earned = unipoolHelper.earned(unipoolBalance);
            return {
              user: unipoolBalance.user,
              earned: ethers.utils.formatEther(earned),
            };
          }),
          {
            fields: ['user', 'earned'],
          },
        ),
      );
    }
  }
};

main()
  .then(() => {
    console.log('Done');
  })
  .catch(console.error)
  .finally(() => process.exit());
