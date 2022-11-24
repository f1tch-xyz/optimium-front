import AddIcon from '@mui/icons-material/Add'
import HttpsIcon from '@mui/icons-material/Https'
import RemoveIcon from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import BalanceBlock from '../../components/common/BalanceBlock'
import BigNumberInput from '../../components/common/BigNumberInput'
import MaxButton from '../../components/common/MaxButton'
import { UNI } from '../../constants/tokens'
import { MAX_UINT256 } from '../../constants/values'
import { isPos, toBaseUnitBN } from '../../utils/number'
import { approve, depositPool, withdrawPool } from '../../utils/web'
import styles from './Pool.module.scss'

type WithdrawDepositProps = {
    poolAddress: string
    user: string
    balance: BigNumber
    allowance: BigNumber
    stagedBalance: BigNumber
    status: number
}

function WithdrawDeposit({
    poolAddress,
    user,
    balance,
    allowance,
    stagedBalance,
    status,
}: WithdrawDepositProps) {
    const [depositAmount, setDepositAmount] = useState(new BigNumber(0))
    const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0))

    return (
        <Box className={styles.box_custom_style}>
            {allowance.comparedTo(MAX_UINT256) === 0 ? (
                <div className={styles.wrapper}>
                    {/* total Issued */}
                    <div style={{ whiteSpace: 'nowrap' }}>
                        <BalanceBlock
                            asset="Staged"
                            balance={stagedBalance}
                            suffix={'T-3CRV'}
                        />
                    </div>
                    {/* Deposit UNI-V2 into Pool */}
                    <div className={styles.button_wrapper}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '60%', minWidth: '6em' }}>
                                <>
                                    <BigNumberInput
                                        adornment="T-3CRV"
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
                            <div style={{ width: '40%', minWidth: '7em' }}>
                                <Button
                                    startIcon={status === 0 ? <AddIcon /> : <HttpsIcon />}
                                    onClick={() => {
                                        depositPool(
                                            poolAddress,
                                            toBaseUnitBN(depositAmount, UNI.decimals),
                                            (hash: any) => setDepositAmount(new BigNumber(0))
                                        )
                                    }}
                                    disabled={
                                        poolAddress === '' || status !== 0 || !isPos(depositAmount)
                                    }>
                                    Deposit
                                </Button>
                            </div>
                        </div>
                        <div style={{ flexBasis: '2%' }} />
                        {/* Withdraw Døllar from DAO */}
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '60%', minWidth: '6em' }}>
                                <>
                                    <BigNumberInput
                                        adornment="T-3CRV"
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
                            <div style={{ width: '40%', minWidth: '7em' }}>
                                <Button
                                    startIcon={status === 0 ? <RemoveIcon /> : <HttpsIcon />}
                                    onClick={() => {
                                        withdrawPool(
                                            poolAddress,
                                            toBaseUnitBN(withdrawAmount, UNI.decimals),
                                            (hash: any) => setWithdrawAmount(new BigNumber(0))
                                        )
                                    }}
                                    disabled={
                                        poolAddress === '' || status !== 0 || !isPos(withdrawAmount)
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
                    <div style={{ whiteSpace: 'nowrap' }}>
                        <BalanceBlock
                            asset="Staged"
                            balance={stagedBalance}
                            suffix={'T-3CRV'}
                        />
                    </div>
                    <div style={{ flexBasis: '35%' }} />
                    {/* Approve Pool to spend UNI-V2 */}
                    <div style={{ flexBasis: '33%', paddingTop: '2%' }}>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                                approve(UNI.addr, poolAddress)
                            }}
                            disabled={poolAddress === '' || user === ''}>
                            Approve
                        </Button>
                    </div>
                </div>
            )}
            <div style={{ width: '100%', paddingTop: '2%', textAlign: 'center' }}>
                <span style={{ opacity: 0.5 }}>
                    Get your T-3CRV LP{' '}
                    <a
                        href="https://curve.fi/#/ethereum/pools/factory-v2-229/deposit"
                        target="_blank"
                    >
                        here
                    </a>{' '}
                    by supplying T, DAI, USDC, USDT or 3CRV.
                </span>
            </div>
        </Box>
    )
}

export default WithdrawDeposit
