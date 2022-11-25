import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import HttpsIcon from '@mui/icons-material/Https'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import BalanceBlock from '../../components/common/BalanceBlock'
import BigNumberInput from '../../components/common/BigNumberInput'
import MaxButton from '../../components/common/MaxButton'
import { ESD } from '../../constants/tokens'
import { isPos, toBaseUnitBN } from '../../utils/number'
import { claimPool } from '../../utils/web'
import styles from './Pool.module.scss'

type ClaimProps = {
    poolAddress: string
    claimable: BigNumber
    status: number
}

function Claim({ poolAddress, claimable, status }: ClaimProps) {
    const [claimAmount, setClaimAmount] = useState(new BigNumber(0))

    return (
        <Box height={165} border={'1px solid black'} className={styles.box_custom_style}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                CLAIM
            </Box>
            <Box px={2}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* total Issued */}
                    <div style={{ flexBasis: '32%' }}>
                        <BalanceBlock asset="Claimable" balance={claimable} suffix={'T'} />
                    </div>
                    {/* Deposit UNI-V2 into Pool */}
                    <div style={{ flexBasis: '35%' }} />
                    <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '60%', minWidth: '6em' }}>
                                <>
                                    <BigNumberInput
                                        adornment="T"
                                        value={claimAmount}
                                        setter={setClaimAmount}
                                        disabled={status !== 0}
                                    />
                                    <MaxButton
                                        onClick={() => {
                                            setClaimAmount(claimable)
                                        }}
                                    />
                                </>
                            </div>
                            <div style={{ width: '40%', minWidth: '6em' }}>
                                <Button
                                    startIcon={
                                        poolAddress === '' || status !== 0 || !isPos(claimAmount) ? (
                                            <HttpsIcon />
                                        ) : (
                                            <ArrowDownwardIcon />
                                        )
                                    }
                                    onClick={() => {
                                        claimPool(
                                            poolAddress,
                                            toBaseUnitBN(claimAmount, ESD.decimals),
                                            (hash: any) => setClaimAmount(new BigNumber(0))
                                        )
                                    }}
                                    disabled={
                                        poolAddress === '' || status !== 0 || !isPos(claimAmount)
                                    }>
                                    Claim
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        {' '}
                        Unbond to make rewards claimable after your status is Unlocked{' '}
                    </span>
                </div>
            </Box>
        </Box>
    )
}

export default Claim
