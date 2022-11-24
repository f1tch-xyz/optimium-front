import Box from '@mui/material/Box';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { DollarPool4 } from '../../constants/contracts';
import { ESD, ESDS, USDC } from '../../constants/tokens';
import { DAO_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import { getBalanceBonded, getBalanceOfStaged, getFluidUntil, getLockedUntil, getStats, getStatusOf, getTokenAllowance, getTokenBalance, getTokenTotalSupply } from '../../utils/infura';
import { delineate, toTokenUnitsBN } from '../../utils/number';
import { getPoolAddress } from '../../utils/pool';
import BondUnbond from './BondUnbond';
import AccountPageHeader from './Header';
import styles from './Wallet.module.scss';
import WithdrawDeposit from './WithdrawDeposit';

const Forge = ({ user }: { user: string }) => {

    const [userCRVBalance, setUserCRVBalance] = useState(new BigNumber(0));
    const [userESDBalance, setUserESDBalance] = useState(new BigNumber(0));
    const [userESDAllowance, setUserESDAllowance] = useState(new BigNumber(0));
    const [userESDSBalance, setUserESDSBalance] = useState(new BigNumber(0));
    const [totalESDSSupply, setTotalESDSSupply] = useState(new BigNumber(0));
    const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
    const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
    const [userStatus, setUserStatus] = useState(0);
    const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
    const [lockup, setLockup] = useState(0);
    const [yieldStr, setYield] = useState('');
    const [tvl, setTvl] = useState('');

    useEffect(() => {

        if (user === '') {
            setUserESDBalance(new BigNumber(0))
            setUserESDAllowance(new BigNumber(0))
            setUserESDSBalance(new BigNumber(0))
            setTotalESDSSupply(new BigNumber(0))
            setUserStagedBalance(new BigNumber(0))
            setUserBondedBalance(new BigNumber(0))
            setUserStatus(0)
            return
        }
        let isCancelled = false

        async function updateUserInfo() {
            try {
                const [
                    crvBalance,
                    esdBalance,
                    esdAllowance,
                    esdsBalance,
                    esdsSupply,
                    stagedBalance,
                    bondedBalance,
                    status,
                    poolAddress,
                    fluidUntilStr,
                    lockedUntilStr,
                    stats,
                ] = await Promise.all([
                    getTokenBalance(USDC.addr, user),
                    getTokenBalance(ESD.addr, user),
                    getTokenAllowance(ESD.addr, user, ESDS.addr),
                    getTokenBalance(ESDS.addr, user),
                    getTokenTotalSupply(ESDS.addr),
                    getBalanceOfStaged(ESDS.addr, user),
                    getBalanceBonded(ESDS.addr, user),
                    getStatusOf(ESDS.addr, user),
                    getPoolAddress(),

                    getFluidUntil(ESDS.addr, user),
                    getLockedUntil(ESDS.addr, user),
                    getStats(),
                ])

                const userCRVBalance = toTokenUnitsBN(crvBalance, USDC.decimals)
                const userESDBalance = toTokenUnitsBN(esdBalance, ESD.decimals)
                const userESDSBalance = toTokenUnitsBN(esdsBalance, ESDS.decimals)
                const totalESDSSupply = toTokenUnitsBN(esdsSupply, ESDS.decimals)
                const userStagedBalance = toTokenUnitsBN(stagedBalance, ESDS.decimals)
                const userBondedBalance = toTokenUnitsBN(bondedBalance, ESDS.decimals)
                const userStatus = parseInt(status, 10)
                const fluidUntil = parseInt(fluidUntilStr, 10)
                const lockedUntil = parseInt(lockedUntilStr, 10)

                if (!isCancelled) {
                    setUserCRVBalance(new BigNumber(userCRVBalance))
                    setUserESDBalance(new BigNumber(userESDBalance))
                    setUserESDAllowance(new BigNumber(esdAllowance.toString()))
                    setUserESDSBalance(new BigNumber(userESDSBalance))
                    setTotalESDSSupply(new BigNumber(totalESDSSupply))
                    setUserStagedBalance(new BigNumber(userStagedBalance))
                    setUserBondedBalance(new BigNumber(userBondedBalance))
                    setUserStatus(userStatus)
                    setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil))
                    setLockup(poolAddress === DollarPool4 ? DAO_EXIT_LOCKUP_EPOCHS : 1)
                    setYield(stats.forgeYield)
                    setTvl(stats.forgeTvl)
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
            <AccountPageHeader
                accountESDBalance={userESDBalance}
                accountESDSBalance={userESDSBalance}
                totalESDSSupply={totalESDSSupply}
                accountStagedBalance={userStagedBalance}
                accountBondedBalance={userBondedBalance}
                accountStatus={userStatus}
                unlocked={userStatusUnlocked}
            />

            <div className={styles.stats}>
                <Box>
                    <div style={{ fontSize: 16 }}>Forge Epoch Yield</div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        {delineate(Number(yieldStr).toFixed(3)) + '%'}
                    </div>
                </Box>

                <Box>
                    <div style={{ fontSize: 16 }}>Forge APY</div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        {delineate((Number(yieldStr) * 48 * 365).toFixed(3)) + '%'}
                    </div>
                </Box>

                <Box>
                    <div style={{ fontSize: 16 }}>Forge TVL</div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        {'$' + delineate(Number(tvl).toFixed(2))}
                    </div>
                </Box>
            </div>

            <WithdrawDeposit
                user={user}
                balance={userESDBalance}
                allowance={userESDAllowance}
                stagedBalance={userStagedBalance}
                status={userStatus}
            />

            <BondUnbond
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
                lockup={lockup}
            />
        </>
    )
}

export default Forge