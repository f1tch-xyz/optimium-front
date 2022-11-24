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
        <Box className={styles.box_custom_style}>
            <div className={styles.wrapper}>
                {/* Total bonded */}

                <div style={{ display: 'flex' }}>
                    <div style={{ whiteSpace: 'nowrap' }}>
                        <BalanceBlock asset="Bonded" balance={bonded} suffix={'T-3CRV'} />
                    </div>
                </div>
                <div className={styles.button_wrapper}>
                    {/* Bond UNI-V2 within Pool */}
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '60%', minWidth: '6em' }}>
                            <>
                                <BigNumberInput
                                    adornment="T-3CRV"
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
                        <div style={{ width: '40%', minWidth: '7em' }}>
                            <Button
                                startIcon={status === 0 ? <AddIcon /> : <WarningAmberIcon />}
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
                    </div>
                    <div style={{ flexBasis: '2%' }} />
                    {/* Unbond UNI-V2 within Pool */}
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '60%', minWidth: '6em' }}>
                            <>
                                <BigNumberInput
                                    adornment="T-3CRV"
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
                        <div style={{ width: '40%', minWidth: '7em' }}>
                            <Button
                                startIcon={status === 0 ? <RemoveIcon /> : <WarningAmberIcon />}
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
                </div>
            </div>
            <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
                <span style={{ opacity: 0.5 }}>
                    {' '}
                    Bonding events will restart the lockup timer (Exit lockup: {
                        lockup
                    }{' '}
                    epochs)
                </span>
            </div>
        </Box>
    )
}

export default BondUnbond
