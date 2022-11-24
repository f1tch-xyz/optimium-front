import BigNumber from 'bignumber.js'
import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

/**
 * Convert 10.999 to 10999000
 */
export function toBaseUnitBN(
  rawAmt: string | number | BigNumber,
  decimals: number
): BigNumber {
  const raw = new BigNumber(rawAmt)
  const base = new BigNumber(10)
  const decimalsBN = new BigNumber(decimals)
  return raw.times(base.pow(decimalsBN)).integerValue()
}

/**
 * Convert 10999000 to 10.999
 */
export const toTokenUnitsBN = (
  tokenAmount: string | number | BigNumberish | any,
  tokenDecimals: number
): BigNumber => {
  return new BigNumber(formatUnits(tokenAmount, tokenDecimals))
}

export const isPos = (amount: BigNumber): boolean => {
  return !amount.isZero() && amount.isPositive()
}

export const ownership = (
  balance: BigNumber,
  totalSupply: BigNumber
): BigNumber => {
  return balance.multipliedBy(new BigNumber(100)).dividedBy(totalSupply)
}

/**
 * BigNumber string formatting
 */

export const formatBN = (amount: BigNumber, position: number): string => {
  if (amount.isLessThan(new BigNumber(1))) {
    return pad(
      amount.precision(position, BigNumber.ROUND_UP).toFixed(),
      position
    )
  }
  return delineate(amount.toFixed(position))
}

export function delineate(bnStr:any) {
  const parts = bnStr.split('.')
  return (
    parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1]
  )
}

function pad(bnStr:any, position:any) {
  if (!bnStr.includes('.')) {
    bnStr += '.'
  }

  const parts = bnStr.split('.')
  for (let i = 0; i < position - parts[1].length; i++) {
    bnStr += '0'
  }

  return bnStr
}

export function formatMoney(n) {
  n = n.toPrecision(3)
  return Math.abs(Number(n)) >= 1.0e9
    ? Math.abs(Number(n)) / 1.0e9 + 'B'
    : Math.abs(Number(n)) >= 1.0e6
    ? Math.abs(Number(n)) / 1.0e6 + 'MM'
    : Math.abs(Number(n)) >= 1.0e3
    ? Math.abs(Number(n)) / 1.0e3 + 'K'
    : Math.abs(Number(n))
}
