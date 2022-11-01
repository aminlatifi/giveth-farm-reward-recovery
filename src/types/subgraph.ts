export interface IUnipool {
  totalSupply: string;
  lastUpdateTime: number;
  periodFinish: number;
  rewardPerTokenStored: string;
  rewardRate: string;
}

export interface IUnipoolBalance {
  user: string;
  balance: string;
  rewards: string;
  rewardPerTokenPaid: string;
}
