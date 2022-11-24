import BigNumber from "bignumber.js";
import { UniswapV2Router02 } from "../constants/contracts";
import { ESD, ESDS, UNI, USDC } from "../constants/tokens";
import { POOL, POOL_EXIT_LOCKUP_EPOCHS } from "../constants/values";
import { Contract } from "ethers";
import { getProvider } from "@wagmi/core";
import { formatBN, toBaseUnitBN, toTokenUnitsBN } from "./number";
import { formatEther, parseEther } from "ethers/lib/utils";

import uniswapV2Router02 from "../constants/abi/uniswapV2Router02.json";
import titanium from "../constants/abi/titanium.json";
import metaPool from "../constants/abi/metaPool.json";
import pool from "../constants/abi/pool.json";
import dao from "../constants/abi/dao.json";
import curve from "../constants/abi/curve.json";

// const metapoolAbi = require('../constants/abi/Dollar.json')
// const daoAbi = require('../constants/abi/Implementation.json')
let daoAbi = dao.abi;
let titaniumAbi = titanium.abi;
// const poolAbi = require('../constants/abi/Pool.json')
let poolAbi = pool.abi;
// const poolFactoryAbi = require('../constants/abi/PoolFactory.json')
// const uniswapRouterAbi = require('../constants/abi/UniswapV2Router02.json')
let uniswapRouterAbi = uniswapV2Router02.abi;
// const uniswapPairAbi = require('../constants/abi/UniswapV2Pair.json')
// const metapoolAbi = require('../constants/abi/IMetaPool.json')
let metapoolAbi = metaPool.abi as any;

/**
 *
 * @param {string} token address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getTokenBalance = async (token: any, account: any) => {
  console.log('token', token);
  console.log('account', account);
  
  if (account === "") return "0";
  const tokenContract = new Contract(token, titaniumAbi, await getProvider());
  return tokenContract.balanceOf(account);
};

export const getTokenTotalSupply = async (token: any) => {
  const tokenContract = new Contract(token, titaniumAbi, await getProvider());
  return tokenContract.totalSupply();
};

/**
 *
 * @param {string} token
 * @param {string} account
 * @param {string} spender
 * @return {Promise<string>}
 */
export const getTokenAllowance = async (
  token: any,
  account: any,
  spender: any
) => {
  const tokenContract = new Contract(token, titaniumAbi, await getProvider());
  return tokenContract.allowance(account, spender);
};

// Døllar Protocol

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceBonded = async (dao: any, account: any) => {
  if (account === "") return "0";
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.balanceOfBonded(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceOfStaged = async (dao: any, account: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.balanceOfStaged(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getStatusOf = async (dao: any, account: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.statusOf(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getFluidUntil = async (dao: any, account: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.fluidUntil(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLockedUntil = async (dao: any, account: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.lockedUntil(account);
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpoch = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.epoch();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochTime = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.epochTime();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalDebt = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalDebt();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalRedeemable = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalRedeemable();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalCoupons = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalCoupons();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalCouponsUnderlying = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalCouponUnderlying();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalBonded = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalBonded();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalStaged = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalStaged();
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getTotalBondedAt = async (dao: any, epoch: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.totalBondedAt(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getApproveFor = async (dao: any, candidate: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.approveFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRejectFor = async (dao: any, candidate: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.rejectFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getStartFor = async (dao: any, candidate: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.startFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getPeriodFor = async (dao: any, candidate: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.periodFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<boolean>}
 */
export const getIsInitialized = async (dao: any, candidate: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.isInitialized(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRecordedVote = async (
  dao: any,
  account: any,
  candidate: any
) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.recordedVote(account, candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCoupons = async (
  dao: any,
  account: any,
  epoch: any
) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.balanceOfCoupons(account, epoch);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchBalanceOfCoupons = async (
  dao: any,
  account: any,
  epochs: any
) => {
  const calls = epochs.map((epoch: any) =>
    getBalanceOfCoupons(dao, account, epoch)
  );
  return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCouponsUnderlying = async (
  dao: any,
  account: any,
  epoch: any
) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.balanceOfCouponUnderlying(account, epoch);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchBalanceOfCouponsUnderlying = async (
  dao: any,
  account: any,
  epochs: any
) => {
  const calls = epochs.map((epoch: any) =>
    getBalanceOfCouponsUnderlying(dao, account, epoch)
  );
  return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch address
 * @return {Promise<string>}
 */
export const getOutstandingCoupons = async (dao: any, epoch: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.outstandingCoupons(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getCouponsExpiration = async (dao: any, epoch: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.couponsExpiration(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchCouponsExpiration = async (dao: any, epochs: any) => {
  const calls = epochs.map((epoch: any) => getCouponsExpiration(dao, epoch));
  return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {string|BigNumber} amount uint256
 * @return {Promise<string>}
 */
export const getCouponPremium = async (dao: any, amount: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.couponPremium(new BigNumber(amount).toFixed());
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getImplementation = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.implementation();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getPool = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  return daoContract.pool();
};

/**
 *
 * @param {string} dao
 * @param {string} account
 * @return {Promise<any[]>}
 */
export const getCouponEpochs = async (dao: any, account: any) => {
  const provider = await getProvider();
  const daoContract = new Contract(dao, daoAbi, provider);
  // const block = await provider.getBlockNumber()
  const blockNumber = 16022755;
  const purchaseP = daoContract.queryFilter(
    daoContract.filters.CouponPurchase(),
    blockNumber
  );
  const transferP = daoContract.queryFilter(
    daoContract.filters.CouponTransfer(),
    blockNumber
  );
  const [bought, given] = await Promise.all([purchaseP, transferP]);
  console.log(bought, given);
  const events = bought
    .map((e: any) => ({
      account: e.args.account,
      epoch: e.args.epoch,
      amount: e.args.couponAmount,
    }))
    .concat(
      given.map((e: any) => ({
        account: e.args.account,
        epoch: e.args.epoch,
        amount: 0,
      }))
    );

  const couponEpochs = [
    ...events
      .reduce((map: any, event) => {
        const { account, epoch, amount } = event;
        const prev = map.get(epoch);

        if (prev) {
          map.set(epoch, {
            account,
            epoch,
            coupons: prev.coupons.add(amount),
          });
        } else {
          map.set(epoch, { account, epoch, coupons: amount });
        }

        return map;
      }, new Map())
      .values(),
  ];

  return couponEpochs.sort((a, b) => a - b);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllProposals = async (dao: any) => {
  const daoContract = new Contract(dao, daoAbi, await getProvider());
  const payload = (
    await daoContract.getPastEvents("Proposal", {
      fromBlock: 0,
    })
  ).map((event: any) => {
    const prop = event.returnValues;
    prop.blockNumber = event.blockNumber;
    return prop;
  });
  return payload.sort((a: any, b: any) => b.blockNumber - a.blockNumber);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllRegulations = async (dao: any) => {
  const provider = await getProvider();
  const daoContract = new Contract(dao, daoAbi, provider);
  const block = await provider.getBlockNumber();
  const blockNumber = block - 3000;
  const increaseP = daoContract.queryFilter(
    daoContract.filters.SupplyIncrease(),
    blockNumber
  );
  const decreaseP = daoContract.queryFilter(
    daoContract.filters.SupplyDecrease(),
    blockNumber
  );
  const neutralP = daoContract.queryFilter(
    daoContract.filters.SupplyNeutral(),
    blockNumber
  );

  const [increase, decrease, neutral] = await Promise.all([
    increaseP,
    decreaseP,
    neutralP,
  ]);

  const events = increase
    .map((e: any) => ({ type: "INCREASE", data: e.args }))
    .concat(
      decrease.map((e: any) => ({
        type: "DECREASE",
        data: e.args,
      }))
    )
    .concat(
      neutral.map((e: any) => ({
        type: "NEUTRAL",
        data: e.args,
      }))
    );

  return events.sort((a, b) => b.data.epoch - a.data.epoch);
};

// Uniswap Protocol

export const getCost = async (amount: any) => {
  const exchange = new Contract(
    UniswapV2Router02,
    uniswapRouterAbi,
    await getProvider()
  );
  // eslint-disable-next-line no-unused-vars
  const [inputAmount, _] = await exchange.getAmountsIn(
    new BigNumber(amount).toFixed(),
    [USDC.addr, ESD.addr]
  );

  return inputAmount;
};

export const getProceeds = async (amount: any) => {
  const exchange = new Contract(
    UniswapV2Router02,
    uniswapRouterAbi,
    await getProvider()
  );
  // eslint-disable-next-line no-unused-vars
  const [_, outputAmount] = await exchange.getAmountsOut(
    new BigNumber(amount).toFixed(),
    [ESD.addr, USDC.addr]
  );

  return outputAmount;
};

export const getReserves = async () => {
  const exchange = new Contract(UNI.addr, metapoolAbi, await getProvider());
  try {
    return await exchange.get_balances();
  } catch (error) {
    console.log(error);
  }
};

export const getThreeCRVPrice = async () => {
  const threePool = new Contract(
    "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
    metapoolAbi,
    await getProvider()
  );
  try {
    return await threePool.get_virtual_price();
  } catch (error) {
    console.log(error);
  }
};

export const getInstantaneousPrice = async () => {
  const provider = await getProvider();
  const exchange = new Contract(UNI.addr, metapoolAbi, provider);
  const threePool = new Contract(
    "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
    metapoolAbi,
    provider
  );
  try {
    const [threeCRVPrice, TPrice] = await Promise.all([
      threePool.get_virtual_price(),
      exchange.get_dy(0, 1, parseEther("1"), [0, 0]),
    ]);

    const price = toTokenUnitsBN(threeCRVPrice, USDC.decimals).multipliedBy(
      toTokenUnitsBN(TPrice, USDC.decimals)
    );
    return price;
  } catch (error) {
    console.log(error);
  }
};

export const getToken0 = async () => {
  const exchange = new Contract(UNI.addr, metapoolAbi, await getProvider());
  return exchange.coins(0);
};

// Pool

export const getPoolStatusOf = async (pool: any, account: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.statusOf(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfBonded = async (pool: any, account: any) => {
  if (account === "") return "0";
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.balanceOfBonded(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaged = async (pool: any, account: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.balanceOfStaged(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded = async (pool: any, account: any) => {
  if (account === "") return "0";
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.balanceOfRewarded(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool: any, account: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.balanceOfClaimable(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalBonded = async (pool: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.totalBonded();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalRewarded = async (pool: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.totalRewarded();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalClaimable = async (pool: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());
  return poolContract.totalClaimable();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolFluidUntil = async (pool: any, account: any) => {
  const poolContract = new Contract(pool, poolAbi, await getProvider());

  const fluidUntil = await poolContract.fluidUntil(account);

  return fluidUntil.toString();
};

export const getForgeYield = async () => {
  const [totalBonded, totalSupply] = await Promise.all([
    getTotalBonded(ESDS.addr),
    getTokenTotalSupply(ESD.addr),
  ]);

  return new BigNumber(0.005)
    .div(
      new BigNumber(totalBonded.toString()).div(
        new BigNumber(totalSupply.toString())
      )
    )
    .times(100);
};

export const getPoolYield = async () => {
  const [tPrice, regs, tvl]: any = await Promise.all([
    getInstantaneousPrice(),
    getAllRegulations(ESDS.addr),
    getPoolTVL(),
  ]);

  return tPrice
    .times(new BigNumber(formatEther(regs[0].data.newBonded)).div(2))
    .div(tvl)
    .times(100);
};

export const getForgeTVL = async () => {
  const [totalBonded, price]: any = await Promise.all([
    getTotalBonded(ESDS.addr),
    getInstantaneousPrice(),
  ]);

  return new BigNumber(formatEther(totalBonded))
    .times(new BigNumber(price as any))
    .toFixed();
};

export const getPoolTVL = async () => {
  const [reserves, threeCRVPrice, price, totalLpPool, totalLpSupply]: any =
    await Promise.all([
      getReserves(),
      getThreeCRVPrice(),
      getInstantaneousPrice(),
      getTokenBalance(UNI.addr, POOL),
      getTokenTotalSupply(UNI.addr),
    ]);

  return new BigNumber(formatEther(reserves[0]))
    .times(price as any)
    .plus(
      new BigNumber(formatEther(reserves[1])).times(
        new BigNumber(formatEther(threeCRVPrice))
      )
    )
    .div(formatEther(totalLpSupply))
    .times(formatEther(totalLpPool))
    .toFixed();
};

export const getTotalTVL = async () => {
  const [forgeTotal, poolTotal]: any = await Promise.all([
    getForgeTVL(),
    getPoolTVL(),
  ]);
  return formatBN(new BigNumber(forgeTotal).plus(poolTotal), 2);
};

export const getStats = async () => {
  return (await fetch("https://api.optiprotocol.xyz/stats")).json();
};
