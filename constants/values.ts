import BigNumber from 'bignumber.js'

// eslint-disable-next-line import/prefer-default-export
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1)
export const GOVERNANCE_QUORUM = new BigNumber('0.20')
export const GOVERNANCE_PROPOSAL_THRESHOLD = new BigNumber('0.005')
export const COUPON_EXPIRATION = 8640
export const DAO_EXIT_LOCKUP_EPOCHS = 240
export const POOL_EXIT_LOCKUP_EPOCHS = 144
export const EPOCH_START = 1669640400
export const POOL = '0xc2d92D8DA97bC39b097f7BeAeB24D149C6FC35A0'
