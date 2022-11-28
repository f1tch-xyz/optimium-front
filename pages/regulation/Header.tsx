import React from 'react'

import BigNumber from 'bignumber.js'

import { formatMoney, ownership } from '../../utils/number'
import styles from './Regulation.module.scss'
import Box from '@mui/material/Box'
import Distribution from '../../components/common/Distribution'

type RegulationHeaderProps = {
    totalSupply: BigNumber

    totalBonded: BigNumber
    totalStaged: BigNumber
    totalRedeemable: BigNumber

    poolLiquidity: BigNumber
    poolRewarded: BigNumber
    poolClaimable: BigNumber

    legacyPoolRewarded: BigNumber
    legacyPoolClaimable: BigNumber

    totalDebt: BigNumber
    totalCoupons: BigNumber
    totalCouponsUnderlying: BigNumber
    couponPremium: BigNumber
}

const RegulationHeader = ({
    totalSupply,
    totalBonded,
    totalStaged,
    totalRedeemable,
    poolLiquidity,
    poolRewarded,
    poolClaimable,
    legacyPoolRewarded,
    legacyPoolClaimable,
    totalDebt,
    totalCoupons,
    totalCouponsUnderlying,
    couponPremium,
}: RegulationHeaderProps) => {
    const daoTotalSupply = totalBonded?.plus(totalStaged).plus(totalRedeemable);
    const poolTotalSupply = poolLiquidity?.plus(poolRewarded).plus(poolClaimable);
    const legacyPoolTotalSupply = legacyPoolRewarded?.plus(legacyPoolClaimable);
    const circulatingSupply = totalSupply?.minus(daoTotalSupply).minus(poolTotalSupply).minus(legacyPoolTotalSupply);

    return (
        <>
            <div className={styles.history_wrapper}>
                <div className={styles.history_content}>
                    <Box pb={1} className={styles.history_box}>
                        <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                            SUPPLY ALLOCATION
                        </Box>
                        <Distribution
                            heading={`OD ${formatMoney(totalSupply?.toNumber())}`}
                            items={[
                                {
                                    item: 'Forge',
                                    percentage: +ownership(daoTotalSupply, totalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Pool',
                                    percentage: +ownership(poolTotalSupply, totalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Circulating',
                                    percentage: +ownership(circulatingSupply, totalSupply)?.toNumber().toFixed(2),
                                },
                            ]}
                        />
                    </Box>
                </div>
                <div className={styles.history_content}>
                    <Box pb={1} className={styles.history_box}>
                        <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                            FORGE BREAKDOWN
                        </Box>
                        <Distribution
                            heading={`OD ${formatMoney(daoTotalSupply?.toNumber())}`}
                            items={[
                                {
                                    item: 'Bonded',
                                    percentage: +ownership(totalBonded, daoTotalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Staged',
                                    percentage: +ownership(totalStaged, daoTotalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Redeemable',
                                    percentage: +ownership(totalRedeemable, daoTotalSupply)?.toNumber().toFixed(2),
                                },
                            ]}
                        />
                    </Box>
                </div>
                <div className={styles.history_content}>
                    <Box pb={1} className={styles.history_box}>
                        <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                            POOL BREAKDOWN
                        </Box>
                        <Distribution
                            heading={`OD ${formatMoney(poolTotalSupply?.toNumber())}`}
                            items={[
                                {
                                    item: 'Liquidity',
                                    percentage: +ownership(poolLiquidity, poolTotalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Rewarded',
                                    percentage: +ownership(poolRewarded, poolTotalSupply)?.toNumber().toFixed(2),
                                },
                                {
                                    item: 'Claimable',
                                    percentage: +ownership(poolClaimable, poolTotalSupply)?.toNumber().toFixed(2),
                                },
                            ]}
                        />
                    </Box>
                </div>
            </div>
        </>
    )
}

export default RegulationHeader
