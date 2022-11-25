import React from 'react';
import BigNumber from 'bignumber.js';

import styles from './Trade.module.scss';
import BalanceBlock from '../../components/common/BalanceBlock';
import AddressBlock from '../../components/common/AddressBlock';

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
            <div style={{ flexBasis: '25%' }}>
                <BalanceBlock asset="T Price" balance={price} suffix={'USD'} />
            </div>
            <div style={{ flexBasis: '25%' }}>
                <BalanceBlock
                    asset="T Liquidity"
                    balance={pairBalanceESD}
                    suffix={'T'}
                />
            </div>
            <div style={{ flexBasis: '25%' }}>
                <BalanceBlock
                    asset="3CRV Liquidity"
                    balance={pairBalanceUSDC}
                    suffix={'3CRV'}
                />
            </div>
            <div style={{ flexBasis: '25%' }}>
                <>
                    <AddressBlock label="Curve Contract" address={uniswapPair} />
                </>
            </div>
        </div>
    )
}

export default TradePageHeader