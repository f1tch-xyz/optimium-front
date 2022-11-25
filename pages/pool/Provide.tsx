import AddIcon from '@mui/icons-material/Add'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import HttpsIcon from '@mui/icons-material/Https'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BigNumber from 'bignumber.js'
import { parseEther } from 'ethers/lib/utils'
import { useState } from 'react'
import BalanceBlock from '../../components/common/BalanceBlock'
import BigNumberInput from '../../components/common/BigNumberInput'
import MaxButton from '../../components/common/MaxButton'
import { USDC } from '../../constants/tokens'
import { MAX_UINT256 } from '../../constants/values'
import { isPos } from '../../utils/number'
import { approve, providePool } from '../../utils/web'
import styles from './Pool.module.scss'

type ProvideProps = {
    poolAddress: string
    user: string
    rewarded: BigNumber
    pairBalanceESD: BigNumber
    pairBalanceUSDC: BigNumber
    userUSDCBalance: BigNumber
    userUSDCAllowance: BigNumber
    status: number
}

function Provide({
    poolAddress,
    user,
    rewarded,
    pairBalanceESD,
    pairBalanceUSDC,
    userUSDCBalance,
    userUSDCAllowance,
    status,
}: ProvideProps) {
    const [provideAmount, setProvideAmount] = useState(new BigNumber(0))
    const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0))

    const USDCToESDRatio = pairBalanceUSDC?.isZero() ? new BigNumber(1) : pairBalanceUSDC?.div(pairBalanceESD)

    const onChangeAmountESD = (amountESD: any) => {
        if (!amountESD) {
            setProvideAmount(new BigNumber(0))
            setUsdcAmount(new BigNumber(0))
            return
        }

        const amountESDBN = new BigNumber(amountESD)
        setProvideAmount(amountESDBN)
        setUsdcAmount(amountESDBN)
    }

    return (
        <Box border={'1px solid black'} className={styles.box_custom_style}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                PROVIDE
            </Box>
            <Box px={2}>
                {userUSDCAllowance?.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ? (
                    <div style={{ display: 'flex', height: '100px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* total rewarded */}
                        <div style={{ flexBasis: '32%' }}>
                            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={'T'} />
                        </div>
                        <div style={{ flexBasis: '33%' }}>
                            <BalanceBlock
                                asset="3CRV Balance"
                                balance={userUSDCBalance}
                                suffix={'3CRV'}
                            />
                        </div>
                        <div style={{ flexBasis: '2%' }} />
                        {/* Provide liquidity using Pool rewards */}
                        <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '60%', minWidth: '6em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="T"
                                            value={provideAmount}
                                            setter={onChangeAmountESD}
                                            disabled={status === 1}
                                        />
                                        <MaxButton
                                            onClick={() => {
                                                onChangeAmountESD(rewarded)
                                            }}
                                        />
                                    </>
                                </div>
                                <div style={{ width: '40%', minWidth: '6em' }}>
                                    <Button
                                        startIcon={
                                            poolAddress === '' ||
                                                status !== 0 ||
                                                !isPos(provideAmount) ||
                                                usdcAmount.isGreaterThan(userUSDCBalance) ? (
                                                <HttpsIcon />
                                            ) : (
                                                <ArrowUpwardIcon />
                                            )
                                        }
                                        onClick={() => {
                                            providePool(
                                                poolAddress,
                                                parseEther(provideAmount.toString()),
                                                (hash: any) => setProvideAmount(new BigNumber(0))
                                            )
                                        }}
                                        disabled={
                                            poolAddress === '' ||
                                            status !== 0 ||
                                            !isPos(provideAmount) ||
                                            usdcAmount.isGreaterThan(userUSDCBalance)
                                        }>
                                        Provide
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', height: '100px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* total rewarded */}
                        <div style={{ flexBasis: '32%' }}>
                            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={'T'} />
                        </div>
                        <div style={{ flexBasis: '33%', textAlign: 'center' }}>
                            <BalanceBlock
                                asset="3CRV Balance"
                                balance={userUSDCBalance}
                                suffix={'3CRV'}
                            />
                        </div>
                        <div style={{ flexBasis: '2%' }} />
                        {/* Approve Pool to spend USDC */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexBasis: '33%' }}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    approve(USDC.addr, poolAddress)
                                }}
                                disabled={poolAddress === '' || user === ''}>
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
                <div style={{ width: '100%', paddingTop: '2%', marginBottom: '5px', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        {' '}
                        Zap your rewards directly to LP by providing equal 3CRV{' '}
                    </span>
                </div>
            </Box>
        </Box>
    )
}

export default Provide
