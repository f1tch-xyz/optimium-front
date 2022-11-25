import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { BalanceBlock, BigNumberInput, MaxButton } from '../../components/common';
import { ESD, ESDS } from '../../constants/tokens';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { bond, unbondUnderlying } from '../../utils/web';
import styles from './Wallet.module.scss';

type BondUnbondProps = {
    staged: BigNumber
    bonded: BigNumber
    status: number
    lockup: number
}

function BondUnbond({ staged, bonded, status, lockup }: BondUnbondProps) {
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
                            <BalanceBlock asset="Bonded" balance={bonded} suffix={'T'} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                            {/* Bond Døllar within DAO */}
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '60%', minWidth: '6em' }}>
                                    <BigNumberInput
                                        adornment="T"
                                        value={bondAmount}
                                        setter={setBondAmount}
                                    />
                                    <MaxButton
                                        onClick={() => {
                                            setBondAmount(staged)
                                        }}
                                    />
                                </div>
                                <div style={{ width: '40%', minWidth: '7em' }}>
                                    <Button
                                        startIcon={status === 0 ? <AddIcon /> : <WarningAmberIcon />}
                                        onClick={() => {
                                            bond(ESDS.addr, toBaseUnitBN(bondAmount, ESD.decimals))
                                        }}
                                        disabled={
                                            status === 2 ||
                                            !isPos(bondAmount) ||
                                            bondAmount.isGreaterThan(staged)
                                        }>
                                        Bond
                                    </Button>
                                </div>
                            </div>
                        </Box>

                        {/* <div style={{ width: '2%' }} /> */}

                        <Box>
                            {/* Unbond Døllar within DAO */}
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '60%', minWidth: '6em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="T"
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
                                            unbondUnderlying(
                                                ESDS.addr,
                                                toBaseUnitBN(unbondAmount, ESD.decimals)
                                            )
                                        }}
                                        disabled={
                                            status === 2 ||
                                            !isPos(unbondAmount) ||
                                            unbondAmount.isGreaterThan(bonded)
                                        }>
                                        Unbond
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </div>
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
