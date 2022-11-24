/* eslint-disable camelcase */
import BigNumber from 'bignumber.js'

// import { notify } from './txNotifier'
import { UniswapV2Router02 } from '../constants/contracts'

import { ESD, UNI, USDC } from '../constants/tokens'
import { fetchSigner, getAccount } from '@wagmi/core'
import { Contract } from 'ethers'
import { getEpoch } from './infura'

import uniswapV2Router02 from "../constants/abi/uniswapV2Router02.json";
import titanium from "../constants/abi/titanium.json";
import metaPool from "../constants/abi/metaPool.json";
import pool from "../constants/abi/pool.json";
import dao from "../constants/abi/dao.json";

let uniswapRouterAbi = uniswapV2Router02.abi;
let titaniumAbi = titanium.abi;
let daoAbi = dao.abi;
let poolAbi = pool.abi;
let metapoolAbi = metaPool.abi as any;


const DEADLINE_FROM_NOW = 60 * 15
const UINT256_MAX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/**
 * Connection Utilities
 */

export const updateModalMode = async (theme : any) => {
  ;(window as any).darkMode = theme === 'dark'
}

export const connect = async (ethereum: any) => {
  // window.web3 = new Web3(ethereum)
  // let addresses = await window.web3.eth.getAccounts()
  // if (!addresses.length) {
  //   try {
  //     addresses = await window.ethereum.enable()
  //   } catch (e) {
  //     console.log(e)
  //     return false
  //   }
  // }
  // return addresses.length ? addresses[0].toLowerCase() : null
}

// eslint-disable-next-line consistent-return
export const checkConnectedAndGetAddress = async () => {
  const { address } = await getAccount()
  const signer: any = await fetchSigner()
  return { account: address, signer }
}

/**
 * ERC20 Utilities
 */

export const approve = async (tokenAddr : any, spender: any, amt = UINT256_MAX) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const oToken = new Contract(tokenAddr, titaniumAbi, signer)
  try {
    const tx = await oToken.approve(spender, amt)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const mintTestnetUSDC = async (amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const usdc = new Contract(USDC.addr, titaniumAbi, signer)

  try {
    const tx = await usdc.mint(account, new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const buyT = async (amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const metapool = new Contract(UNI.addr, metapoolAbi, signer)

  try {
    const tx = await metapool.exchange(1, 0, new BigNumber(amount).toFixed(), 0)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const sellT = async (amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const metapool = new Contract(UNI.addr, metapoolAbi, signer)

  try {
    const tx = await metapool.exchange(0, 1, new BigNumber(amount).toFixed(), 0)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const addLiquidity = async (TAmount: any, ThreeCRVAmount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const metapool = new Contract(UNI.addr, metapoolAbi, signer)

  try {
    const tx = await metapool.add_liquidity(
      [
        new BigNumber(TAmount).toFixed(),
        new BigNumber(ThreeCRVAmount).toFixed(),
      ],
      0
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Uniswap Protocol
 */

export const buyESD = async (buyAmount: any, maxInputAmount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const router = new Contract(UniswapV2Router02, uniswapRouterAbi, signer)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  try {
    const tx = await router.swapTokensForExactTokens(
      buyAmount,
      maxInputAmount,
      [USDC.addr, ESD.addr],
      account,
      deadline
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const sellESD = async (sellAmount: any, minOutputAmount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const router = new Contract(UniswapV2Router02, uniswapRouterAbi, signer)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  try {
    const tx = await router.swapExactTokensForTokens(
      sellAmount,
      minOutputAmount,
      [ESD.addr, USDC.addr],
      account,
      deadline
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

// export const addLiquidity = async (amountESD, amountUSDC, slippage) => {
//   const { account, signer } = await checkConnectedAndGetAddress()
//   const router = new Contract(UniswapV2Router02, uniswapRouterAbi, signer)
//   const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW
//   const slippageBN = new BigNumber(slippage)
//   const minAmountESD = new BigNumber(amountESD)
//     .multipliedBy(new BigNumber(1).minus(slippageBN))
//     .integerValue(BigNumber.ROUND_FLOOR)
//   const minAmountUSDC = new BigNumber(amountUSDC)
//     .multipliedBy(new BigNumber(1).minus(slippageBN))
//     .integerValue(BigNumber.ROUND_FLOOR)

//   try {
//     const tx = await router.addLiquidity(
//       ESD.addr,
//       USDC.addr,
//       new BigNumber(amountESD).toFixed(),
//       new BigNumber(amountUSDC).toFixed(),
//       minAmountESD,
//       minAmountUSDC,
//       account,
//       deadline
//     )
//     // notify.hash(tx.hash)
//     // callback(tx.hash)
//   } catch (error) {
//     console.log(error)
//   }
// }

export const removeLiquidity = async (
  liquidityAmount: any,
  minAmountESD: any,
  minAmountUSDC: any
) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const router = new Contract(UniswapV2Router02, uniswapRouterAbi, signer)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  try {
    const tx = await router.removeLiquidity(
      ESD.addr,
      USDC.addr,
      new BigNumber(liquidityAmount).toFixed(),
      new BigNumber(minAmountESD).toFixed(),
      new BigNumber(minAmountUSDC).toFixed(),
      account,
      deadline
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Døllar Protocol
 */

export const advance = async (dao: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)
  try {
    const epoch = await getEpoch(dao)
    const key = epoch.pow(2).mul(account)
    const tx = await daoContract.advance(key)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const deposit = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.deposit(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const withdraw = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.withdraw(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const bond = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)
  try {
    const tx = await daoContract.bond(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const unbond = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.unbond(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const unbondUnderlying = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.unbondUnderlying(
      new BigNumber(amount).toFixed()
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const purchaseCoupons = async (dao: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.purchaseCoupons(
      new BigNumber(amount).toFixed()
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const redeemCoupons = async (dao: any, epoch: any, amount: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)
  try {
    const tx = await daoContract.redeemCoupons(epoch, amount)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const migrateCoupons = async (dao: any, epoch: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.migrateCoupons(epoch)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const recordVote = async (dao: any, candidate: any, voteType: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.vote(candidate, voteType)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const commit = async (dao: any, candidate: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const daoContract = new Contract(dao, daoAbi, signer)

  try {
    const tx = await daoContract.commit(candidate)
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

/* UNI-V2 Incentivization Pool */
export const depositPool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)

  try {
    const tx = await poolContract.deposit(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const withdrawPool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)

  try {
    const tx = await poolContract.withdraw(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const bondPool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)
  try {
    const tx = await poolContract.bond(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const unbondPool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)
  try {
    const tx = await poolContract.unbond(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const claimPool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)

  try {
    const tx = await poolContract.claim(new BigNumber(amount).toFixed())
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}

export const providePool = async (pool: any, amount: any, callback: any) => {
  const { account, signer } = await checkConnectedAndGetAddress()
  const poolContract = new Contract(pool, poolAbi, signer)
  const lpPool = new Contract(UNI.addr, metapoolAbi, signer)

  try {
    const amountOut = await lpPool.calc_token_amount(
      [amount.toString(), amount.toString()],
      true
    )

    const tx = await poolContract.provide(
      amount.toString(),
      amountOut.sub(amountOut.div(100)).toString()
    )
    // notify.hash(tx.hash)
    // callback(tx.hash)
  } catch (error) {
    console.log(error)
  }
}
