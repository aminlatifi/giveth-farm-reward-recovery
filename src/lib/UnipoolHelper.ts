import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Zero } from '@/helpers/number';
import { IUnipool, IUnipoolBalance } from '@/types/subgraph';

const toBN = (value: ethers.BigNumberish): BigNumber => {
  return new BigNumber(value.toString());
};

export class UnipoolHelper {
  readonly totalSupply: BigNumber;
  private readonly lastUpdateTime: number;
  private readonly periodFinish: number;
  private readonly rewardPerTokenStored: BigNumber;
  private readonly _rewardRate: BigNumber;
  private readonly nowUnixSec: number;

  constructor(
    {
      lastUpdateTime,
      periodFinish,
      rewardPerTokenStored,
      rewardRate,
      totalSupply,
    }: IUnipool,

    nowUnixSec,
  ) {
    this.totalSupply = toBN(totalSupply);
    this.lastUpdateTime = lastUpdateTime;
    this._rewardRate = toBN(rewardRate);
    this.rewardPerTokenStored = toBN(rewardPerTokenStored);
    this.periodFinish = periodFinish;
    this.nowUnixSec = nowUnixSec;
  }

  get lastTimeRewardApplicable(): BigNumber {
    const lastTimeRewardApplicableMS: number = Math.min(
      this.nowUnixSec,
      this.periodFinish,
    );
    return toBN(Math.floor(lastTimeRewardApplicableMS / 1000));
  }

  get rewardRate(): BigNumber {
    if (this.nowUnixSec > this.periodFinish) return Zero;
    return this._rewardRate;
  }

  get rewardPerToken(): BigNumber {
    if (this.totalSupply.isZero()) {
      return this.rewardPerTokenStored;
    }
    return this.rewardPerTokenStored.plus(
      this.lastTimeRewardApplicable
        .minus(this.lastUpdateTime / 1000)
        .times(this.rewardRate)
        .times(1e18)
        .div(this.totalSupply)
        .toFixed(0),
    );
  }

  earned = ({
    rewards,
    rewardPerTokenPaid,
    balance,
  }: IUnipoolBalance): ethers.BigNumber => {
    const earndBN = toBN(balance)
      .times(this.rewardPerToken.minus(toBN(rewardPerTokenPaid)))
      .div(1e18)
      .plus(rewards.toString());
    // console.log('earned:', earndBN.toFixed(0));
    return ethers.BigNumber.from(earndBN.toFixed(0));
  };
}
