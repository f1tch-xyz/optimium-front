import AddIcon from '@mui/icons-material/Add';
import HttpsIcon from '@mui/icons-material/Https';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { BalanceBlock, BigNumberInput, MaxButton } from '../../components/common';
import { ESD, ESDS } from '../../constants/tokens';
import { MAX_UINT256 } from '../../constants/values';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { approve, deposit, withdraw } from '../../utils/web';
import styles from './Wallet.module.scss';

type WithdrawDepositProps = {
    user: string
    balance: BigNumber
    allowance: BigNumber
    stagedBalance: BigNumber
    status: number
}

function WithdrawDeposit({
    user,
    balance,
    allowance,
    stagedBalance,
    status,
}: WithdrawDepositProps) {
    const [depositAmount, setDepositAmount] = useState(new BigNumber(0))
    const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0))

    return (
        <Box border={'1px solid black'}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                STAGE
            </Box>
            <Box px={2}>
                {allowance && allowance.comparedTo(MAX_UINT256) === 0 ? (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ display: 'flex' }}>
                            <div style={{ whiteSpace: 'nowrap' }}>
                                <BalanceBlock asset="Staged" balance={stagedBalance} suffix={'OD'} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '60%' }}>
                            <Box>
                                {/* Deposit Døllar into DAO */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '54%', minWidth: '6em' }}>
                                        <>
                                            <BigNumberInput
                                                adornment="T"
                                                value={depositAmount}
                                                setter={setDepositAmount}
                                                disabled={status !== 0}
                                            />
                                            <MaxButton
                                                onClick={() => {
                                                    setDepositAmount(balance);
                                                }}
                                            />
                                        </>
                                    </div>
                                    <Button
                                        startIcon={status === 0 ? <AddIcon /> : <HttpsIcon />}
                                        sx={{ height: '40px' }}
                                        onClick={() => {
                                            deposit(
                                                ESDS.addr,
                                                toBaseUnitBN(depositAmount, ESD.decimals)
                                            )
                                        }}
                                        disabled={
                                            status === 1 ||
                                            !isPos(depositAmount) ||
                                            depositAmount.isGreaterThan(balance)
                                        }>
                                        Deposit
                                    </Button>
                                </div>
                            </Box>
                            <Box>
                                {/* Withdraw Døllar from DAO */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '54%', minWidth: '6em' }}>
                                        <>
                                            <BigNumberInput
                                                adornment="OD"
                                                value={withdrawAmount}
                                                setter={setWithdrawAmount}
                                                disabled={status !== 0}
                                            />
                                            <MaxButton
                                                onClick={() => {
                                                    setWithdrawAmount(stagedBalance)
                                                }}
                                            />
                                        </>
                                    </div>
                                    <Button
                                        startIcon={status === 0 ? <RemoveIcon /> : <HttpsIcon />}
                                        sx={{ height: '40px' }}
                                        onClick={() => {
                                            withdraw(
                                                ESDS.addr,
                                                toBaseUnitBN(withdrawAmount, ESD.decimals)
                                            )
                                        }}
                                        disabled={
                                            status === 1 ||
                                            !isPos(withdrawAmount) ||
                                            withdrawAmount.isGreaterThan(stagedBalance)
                                        }>
                                        Withdraw
                                    </Button>
                                </div>
                            </Box>
                        </div>
                    </div>
                ) : (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexBasis: '32%' }}>
                            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={'OD'} />
                        </div>
                        <div style={{ flexBasis: '35%' }} />
                        {/* Approve DAO to spend Døllar */}
                        <div className={styles.button_wrapper}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    approve(ESD.addr, ESDS.addr)
                                }}
                                disabled={user === ''}>
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
                <div style={{ width: '100%', paddingTop: '2%', marginBottom: '5px', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        Get your OD tokens{' '}
                        <a
                            href="https://curve.fi/#/ethereum/pools/factory-v2-229/swap"
                            target="_blank"
                            rel="noreferrer">
                            here
                        </a>{' '}
                        by swapping from DAI, USDC, USDT or 3CRV.
                    </span>
                </div>
            </Box>
        </Box >
    )
}

export default WithdrawDeposit;
