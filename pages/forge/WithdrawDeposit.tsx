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
        <Box height={165} border={'1px solid black'}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                STAGE
            </Box>
            <Box px={2}>
                {allowance.comparedTo(MAX_UINT256) === 0 ? (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ flexBasis: '32%' }}>
                            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={'T'} />
                        </div>
                        {/* Deposit Døllar into DAO */}
                        <div className={styles.button_wrapper}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '55%', minWidth: '6em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="T"
                                            value={depositAmount}
                                            setter={setDepositAmount}
                                            disabled={status !== 0}
                                        />
                                        <MaxButton
                                            onClick={() => {
                                                setDepositAmount(balance)
                                            }}
                                        />
                                    </>
                                </div>
                                <div style={{ width: '45%', minWidth: '6em' }}>
                                    <Button
                                        startIcon={status === 0 ? <AddIcon /> : <HttpsIcon />}
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
                            </div>
                            <div style={{ flexBasis: '2%' }} />
                            {/* Withdraw Døllar from DAO */}
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '55%', minWidth: '7em' }}>
                                    <>
                                        <BigNumberInput
                                            adornment="T"
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
                                <div style={{ width: '45%', minWidth: '7em' }}>
                                    <Button
                                        startIcon={status === 0 ? <RemoveIcon /> : <HttpsIcon />}
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
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.wrapper}>
                        {/* total Issued */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexBasis: '32%' }}>
                            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={'T'} />
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
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <span style={{ opacity: 0.5 }}>
                        Get your T tokens{' '}
                        <a
                            href="https://curve.fi/#/ethereum/pools/factory-v2-229/swap"
                            target="_blank"
                        >
                            here
                        </a>{' '}
                        by swapping from DAI, USDC, USDT or 3CRV.
                    </span>
                </div>
            </Box>

        </Box>
    )
}

export default WithdrawDeposit;
