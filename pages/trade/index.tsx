import Box from '@mui/material/Box';
import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { ESD, UNI, USDC } from '../../constants/tokens';
import { getInstantaneousPrice, getTokenBalance } from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';
import TradePageHeader from './Header';
import styles from './Trade.module.scss'

const UniswapPool = ({ user }: { user: string }) => {

    const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
    const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
    const [price, setPrice] = useState<any>(new BigNumber(0));

    useEffect(() => {
        let isCancelled = false

        async function updateUserInfo() {
            try {
                const [pairBalanceESDStr, pairBalanceUSDCStr, price] =
                    await Promise.all([
                        getTokenBalance(ESD.addr, UNI.addr),
                        getTokenBalance(USDC.addr, UNI.addr),
                        getInstantaneousPrice(),
                    ])

                if (!isCancelled) {
                    setPairBalanceESD(toTokenUnitsBN(pairBalanceESDStr, ESD.decimals))
                    setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals))
                    setPrice(price)
                }
            } catch (error) {
                console.log(error)
            }
        }

        updateUserInfo()
        const id = setInterval(updateUserInfo, 15000)

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true
            clearInterval(id)
        }
    }, [user])

    return (
        <>
            {/* <IconHeader icon={<i className="fas fa-exchange-alt" />} text="Trade" /> */}

            <TradePageHeader
                pairBalanceESD={pairBalanceESD}
                pairBalanceUSDC={pairBalanceUSDC}
                price={price}
                uniswapPair={UNI.addr}
            />

            <div className={styles.box_container}>
                <Box m={1} sx={{ height: '200px', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <a href="https://curve.fi/#/ethereum/pools/factory-v2-229/swap">
                        <div className={styles.title}>
                            Info
                        </div>
                        <div className={styles.icon}>
                            CHART ICON
                        </div>
                        <div className={styles.description}>
                            View T-3CRV pool stats.
                        </div>
                    </a>
                </Box>

                <Box m={1} sx={{ height: '200px', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <a href="https://curve.fi/#/ethereum/pools/factory-v2-229/swap">
                        <div className={styles.title}>
                            Trade
                        </div>
                        <div className={styles.icon}>
                            EXCHANGE ICON
                        </div>
                        <div className={styles.description}>
                            Trade T tokens.
                        </div>
                    </a>
                </Box>

                <Box m={1} sx={{ height: '200px', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <a href="https://curve.fi/#/ethereum/pools/factory-v2-229/deposit">
                        <div className={styles.title}>
                            Supply
                        </div>
                        <div className={styles.icon}>
                            WATER ICON
                        </div>
                        <div className={styles.description}>
                            Supply and redeem liquidity.
                        </div>
                    </a>
                </Box>
            </div>
        </>
    )
}

export default UniswapPool;