import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import BigNumber from 'bignumber.js'
import { isPos, toBaseUnitBN } from '../../utils/number'
import { UNI } from '../../constants/tokens'
import styles from './Pool.module.scss'
import Box from '@mui/material/Box'
import BalanceBlock from '../../components/common/BalanceBlock'
import BigNumberInput from '../../components/common/BigNumberInput'
import MaxButton from '../../components/common/MaxButton'
import Button from '@mui/material/Button'
import { bondPool, unbondPool } from '../../utils/web';

type BondUnbondProps = {
    poolAddress: string
    staged: BigNumber
    bonded: BigNumber
    status: number
    lockup: number
}

function BondUnbond({
    poolAddress,
    staged,
    bonded,
    status,
    lockup,
}: BondUnbondProps) {
    const [bondAmount, setBondAmount] = useState(new BigNumber(0))
    const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0))

    return (
        <Box border={'1px solid black'} className={styles.box_custom_style}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                FORGE
            </Box>
            <Box px={2}>
                <div className={styles.wrapper}>
                    {/* Total bonded */}

                    <div style={{ display: 'flex' }}>
                        <div style={{ whiteSpace: 'nowrap' }}>
                            <BalanceBlock asset="Bonded" balance={bonded} suffix={'OD-3CRV'} />
                        </div>
                    </div>
                    <Box>
                        <div style={{ display: 'flex' }}>
                            {/* Bond UNI-V2 within Pool */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ width: '60%', minWidth: '6em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="OD-3CRV"
                                            value={bondAmount}
                                            setter={setBondAmount}
                                        />
                                        <MaxButton
                                            onClick={() => {
                                                setBondAmount(staged)
                                            }}
                                        />
                                    </>
                                </div>
                                <Button
                                    startIcon={status === 0 ? <AddIcon /> : <WarningAmberIcon />}
                                    sx={{ height: '40px' }}
                                    onClick={() => {
                                        bondPool(
                                            poolAddress,
                                            toBaseUnitBN(bondAmount, UNI.decimals),
                                            (hash: any) => setBondAmount(new BigNumber(0))
                                        )
                                    }}
                                    disabled={poolAddress === '' || !isPos(bondAmount)}>
                                    Bond
                                </Button>
                            </div>
                            <div style={{ flexBasis: '2%' }} />
                            {/* Unbond UNI-V2 within Pool */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ width: '60%', minWidth: '6em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="OD-3CRV"
                                            value={unbondAmount}
                                            setter={setUnbondAmount}
                                        />
                                        <MaxButton
                                            onClick={() => {
                                                setUnbondAmount(bonded)
                                            }}
                                        />
                                    </>
                                </div>
                                <Button
                                    startIcon={status === 0 ? <RemoveIcon /> : <WarningAmberIcon />}
                                    sx={{ height: '40px' }}
                                    onClick={() => {
                                        unbondPool(
                                            poolAddress,
                                            toBaseUnitBN(unbondAmount, UNI.decimals),
                                            (hash: any) => setUnbondAmount(new BigNumber(0))
                                        )
                                    }}
                                    disabled={poolAddress === '' || !isPos(unbondAmount)}>
                                    Unbond
                                </Button>
                            </div>
                        </div>
                    </Box>
                </div>
                <div style={{ width: '100%', paddingTop: '2%', marginBottom: '5px', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        {' '}
                        Bonding events will restart the lockup timer (Exit lockup: {
                            lockup
                        }{' '}
                        epochs)
                    </span>
                </div>
            </Box>
        </Box>
    )
}

export default BondUnbond
