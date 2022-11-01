import { IUnipool, IUnipoolBalance } from '@/types/subgraph';
import { gql, request } from 'graphql-request';

const fetchUnipoolQuery = gql`
  query fetchUnipool($unipoolAddress: String!, $blocknumber: Int!) {
    unipool(id: $unipoolAddress, block: { number: $blocknumber }) {
      totalSupply
      lastUpdateTime
      periodFinish
      rewardPerTokenStored
      rewardRate
    }
  }
`;

const fetchUnipoolBalancesQuery = gql`
  query fetchUnipoolBalances(
    $unipoolAddress: String!
    $take: Int!
    $skip: Int!
    $blocknumber: Int!
  ) {
    unipoolBalances(
      first: $take
      skip: $skip
      where: { unipool: $unipoolAddress }
      orderBy: id
      block: { number: $blocknumber }
    ) {
      user {
        id
      }
      balance
      rewards
      rewardPerTokenPaid
    }
  }
`;

export const fetchUnipoolBalances = async (
  subgraphApi: string,
  unipoolAddress: string,
  blocknumber: number,
): Promise<IUnipoolBalance[]> => {
  const take = 50;
  let skip = 0;
  const result: IUnipoolBalance[] = [];
  let finished = false;

  do {
    const data = await request({
      url: subgraphApi,
      document: fetchUnipoolBalancesQuery,
      variables: {
        unipoolAddress: unipoolAddress.toLowerCase(),
        blocknumber,
        take,
        skip,
      },
    });

    const { unipoolBalances } = data;

    skip += unipoolBalances.length;

    unipoolBalances.forEach(
      ({ user, balance, rewards, rewardPerTokenPaid }) => {
        result.push({
          user: user.id,
          balance,
          rewards,
          rewardPerTokenPaid,
        });
      },
    );

    finished = unipoolBalances.length < take;
  } while (!finished);

  return result;
};

export const fetchUnipoolInfo = async (
  subgraphApi: string,
  unipoolAddress: string,
  blocknumber: number,
): Promise<IUnipool> => {
  const data = await request({
    url: subgraphApi,
    document: fetchUnipoolQuery,
    variables: {
      unipoolAddress: unipoolAddress.toLowerCase(),
      blocknumber,
    },
  });

  const {
    totalSupply,
    lastUpdateTime,
    periodFinish,
    rewardPerTokenStored,
    rewardRate,
  }: { [key: string]: string } = data.unipool;

  return {
    totalSupply,
    lastUpdateTime: +lastUpdateTime,
    periodFinish: +periodFinish,
    rewardPerTokenStored,
    rewardRate,
  };
};
