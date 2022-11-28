import React from 'react';
import BigNumber from 'bignumber.js';

import styles from './Trade.module.scss';
import BalanceBlock from '../../components/common/BalanceBlock';
import AddressBlock from '../../components/common/AddressBlock';
import Box from '@mui/material/Box';


type TradePageHeaderProps = {
    pairBalanceESD: BigNumber
    pairBalanceUSDC: BigNumber
    uniswapPair: string
    price: BigNumber
}

const TradePageHeader = ({
    pairBalanceESD,
    pairBalanceUSDC,
    uniswapPair,
    price,
}: TradePageHeaderProps) => {
    return (
        <div className={styles.stats}>
            <Box width={'25%'}>
                <BalanceBlock asset="OD Price" balance={price} suffix={'USD'} />
            </Box>

            <Box width={'25%'}>
                <BalanceBlock
                    asset="OD Liquidity"
                    balance={pairBalanceESD}
                    suffix={'OD'}
                />
            </Box>

            <Box width={'25%'}>
                <BalanceBlock
                    asset="3CRV Liquidity"
                    balance={pairBalanceUSDC}
                    suffix={'3CRV'}
                />
            </Box>

            <Box width={'25%'}>
                <AddressBlock label="Curve Contract" address={uniswapPair} />
            </Box>
        </div>
    )
}

export default TradePageHeader