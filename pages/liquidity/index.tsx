import Box from '@mui/material/Box';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { DollarPool4 } from '../../constants/contracts';
import { ESD, UNI, USDC } from '../../constants/tokens';
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values';
import { getPoolTotalBonded, getTokenBalance, getTokenAllowance, getPoolBalanceOfStaged, getPoolBalanceOfBonded, getPoolBalanceOfRewarded, getPoolBalanceOfClaimable, getPoolStatusOf, getPoolFluidUntil, getStats } from '../../utils/infura';
import { delineate, toTokenUnitsBN } from '../../utils/number';
import { getPoolAddress, getLegacyPoolAddress } from '../../utils/pool';
import BondUnbond from './BondUnbond';
import Claim from './Claim';
import PoolPageHeader from './Header';
import styles from './Pool.module.scss';
import Provide from './Provide';
import WithdrawDeposit from './WithdrawDeposit';

const Liquidity = ({ user }: { user: string }) => {

    const { override } = useParams();
    if (override) {
        user = override
    }

    const [poolAddress, setPoolAddress] = useState('');
    const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
    const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
    const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
    const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
    const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
    const [userUSDCBalance, setUserUSDCBalance] = useState(new BigNumber(0));
    const [userUSDCAllowance, setUserUSDCAllowance] = useState(new BigNumber(0));
    const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
    const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
    const [userRewardedBalance, setUserRewardedBalance] = useState(new BigNumber(0));
    const [userClaimableBalance, setUserClaimableBalance] = useState(new BigNumber(0));
    const [userStatus, setUserStatus] = useState(0);
    const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
    const [legacyUserStagedBalance, setLegacyUserStagedBalance] = useState(new BigNumber(0));
    const [legacyUserBondedBalance, setLegacyUserBondedBalance] = useState(new BigNumber(0));
    const [legacyUserRewardedBalance, setLegacyUserRewardedBalance] = useState(new BigNumber(0));
    const [legacyUserClaimableBalance, setLegacyUserClaimableBalance] = useState(new BigNumber(0));
    const [legacyUserStatus, setLegacyUserStatus] = useState(0);
    const [lockup, setLockup] = useState(0);
    const [yieldStr, setYield] = useState('');
    const [tvl, setTvl] = useState('');

    //Update User balances
    useEffect(() => {
        if (user === '') {
            setPoolAddress('')
            setPoolTotalBonded(new BigNumber(0))
            setPairBalanceESD(new BigNumber(0))
            setPairBalanceUSDC(new BigNumber(0))
            setUserUNIBalance(new BigNumber(0))
            setUserUNIAllowance(new BigNumber(0))
            setUserUSDCBalance(new BigNumber(0))
            setUserUSDCAllowance(new BigNumber(0))
            setUserStagedBalance(new BigNumber(0))
            setUserBondedBalance(new BigNumber(0))
            setUserRewardedBalance(new BigNumber(0))
            setUserClaimableBalance(new BigNumber(0))
            setUserStatus(0)
            setUserStatusUnlocked(0)
            setLegacyUserStagedBalance(new BigNumber(0))
            setLegacyUserBondedBalance(new BigNumber(0))
            setLegacyUserRewardedBalance(new BigNumber(0))
            setLegacyUserClaimableBalance(new BigNumber(0))
            setLegacyUserStatus(0)
            return
        }
        let isCancelled = false

        async function updateUserInfo() {
            try {
                const poolAddressStr = await getPoolAddress()
                const legacyPoolAddress = getLegacyPoolAddress(poolAddressStr)

                const [
                    poolTotalBondedStr,
                    pairBalanceESDStr,
                    pairBalanceUSDCStr,
                    balance,
                    usdcBalance,
                    allowance,
                    usdcAllowance,
                    stagedBalance,
                    bondedBalance,
                    rewardedBalance,
                    claimableBalance,
                    status,
                    fluidUntilStr,
                    legacyStagedBalance,
                    legacyBondedBalance,
                    legacyRewardedBalance,
                    legacyClaimableBalance,
                    legacyStatus,
                    stats,
                ] = await Promise.all([
                    getPoolTotalBonded(poolAddressStr),
                    getTokenBalance(ESD.addr, UNI.addr),
                    getTokenBalance(USDC.addr, UNI.addr),
                    getTokenBalance(UNI.addr, user),
                    getTokenBalance(USDC.addr, user),

                    getTokenAllowance(UNI.addr, user, poolAddressStr),
                    getTokenAllowance(USDC.addr, user, poolAddressStr),
                    getPoolBalanceOfStaged(poolAddressStr, user),
                    getPoolBalanceOfBonded(poolAddressStr, user),

                    getPoolBalanceOfRewarded(poolAddressStr, user),
                    getPoolBalanceOfClaimable(poolAddressStr, user),
                    getPoolStatusOf(poolAddressStr, user),
                    getPoolFluidUntil(poolAddressStr, user),

                    getPoolBalanceOfStaged(legacyPoolAddress, user),
                    getPoolBalanceOfBonded(legacyPoolAddress, user),
                    getPoolBalanceOfRewarded(legacyPoolAddress, user),
                    getPoolBalanceOfClaimable(legacyPoolAddress, user),
                    getPoolStatusOf(legacyPoolAddress, user),
                    getStats(),
                ])

                const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, ESD.decimals)
                const pairESDBalance = toTokenUnitsBN(pairBalanceESDStr, ESD.decimals)
                const pairUSDCBalance = toTokenUnitsBN(
                    pairBalanceUSDCStr,
                    USDC.decimals
                )
                const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals)
                const userUSDCBalance = toTokenUnitsBN(usdcBalance, USDC.decimals)
                const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals)
                const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals)
                const userRewardedBalance = toTokenUnitsBN(
                    rewardedBalance,
                    ESD.decimals
                )
                const userClaimableBalance = toTokenUnitsBN(
                    claimableBalance,
                    ESD.decimals
                )
                const userStatus = parseInt(status, 10)
                const fluidUntil = parseInt(fluidUntilStr, 10)
                const legacyUserStagedBalance = toTokenUnitsBN(
                    legacyStagedBalance,
                    UNI.decimals
                )
                const legacyUserBondedBalance = toTokenUnitsBN(
                    legacyBondedBalance,
                    UNI.decimals
                )
                const legacyUserRewardedBalance = toTokenUnitsBN(
                    legacyRewardedBalance,
                    UNI.decimals
                )
                const legacyUserClaimableBalance = toTokenUnitsBN(
                    legacyClaimableBalance,
                    ESD.decimals
                )
                const legacyUserStatus = parseInt(legacyStatus, 10)

                if (!isCancelled) {
                    setPoolAddress(poolAddressStr)
                    setPoolTotalBonded(new BigNumber(poolTotalBonded))
                    setPairBalanceESD(new BigNumber(pairESDBalance))
                    setPairBalanceUSDC(new BigNumber(pairUSDCBalance))
                    setUserUNIBalance(new BigNumber(userUNIBalance))
                    setUserUNIAllowance(new BigNumber(allowance.toString()))
                    setUserUSDCAllowance(new BigNumber(usdcAllowance.toString()))
                    setUserUSDCBalance(new BigNumber(userUSDCBalance))
                    setUserStagedBalance(new BigNumber(userStagedBalance))
                    setUserBondedBalance(new BigNumber(userBondedBalance))
                    setUserRewardedBalance(new BigNumber(userRewardedBalance))
                    setUserClaimableBalance(new BigNumber(userClaimableBalance))
                    setUserStatus(userStatus)
                    setUserStatusUnlocked(fluidUntil)
                    setLegacyUserStagedBalance(new BigNumber(legacyUserStagedBalance))
                    setLegacyUserBondedBalance(new BigNumber(legacyUserBondedBalance))
                    setLegacyUserRewardedBalance(new BigNumber(legacyUserRewardedBalance))
                    setLegacyUserClaimableBalance(
                        new BigNumber(legacyUserClaimableBalance)
                    )
                    setLegacyUserStatus(legacyUserStatus)
                    setLockup(
                        poolAddressStr === DollarPool4 ? POOL_EXIT_LOCKUP_EPOCHS : 1
                    )
                    setYield(stats.poolYield)
                    setTvl(stats.poolTvl)
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

    // Check for error in .call()
    const isRewardedNegative = legacyUserRewardedBalance.isGreaterThan(new BigNumber('1000000000000000000'));
    const hasLegacyBalance = legacyUserStagedBalance.isGreaterThan(0) || legacyUserClaimableBalance.isGreaterThan(0) || legacyUserBondedBalance.isGreaterThan(0);

    return (
        <>
            <PoolPageHeader
                accountUNIBalance={userUNIBalance}
                accountBondedBalance={userBondedBalance}
                accountRewardedESDBalance={userRewardedBalance}
                accountClaimableESDBalance={userClaimableBalance}
                poolTotalBonded={poolTotalBonded}
                accountPoolStatus={userStatus}
                unlocked={userStatusUnlocked} />

            <div className={styles.stats}>
                <Box>
                    <div style={{ fontSize: 16 }}>Pool Epoch Yield</div>
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
                    <div style={{ fontSize: 16 }}>Pool APR</div>
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
                    <div style={{ fontSize: 16 }}>Pool TVL</div>
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
                poolAddress={poolAddress}
                user={user}
                balance={userUNIBalance}
                allowance={userUNIAllowance}
                stagedBalance={userStagedBalance}
                status={userStatus}
            />

            <BondUnbond
                poolAddress={poolAddress}
                staged={userStagedBalance}
                bonded={userBondedBalance}
                status={userStatus}
                lockup={lockup}
            />

            <Claim
                poolAddress={poolAddress}
                claimable={userClaimableBalance}
                status={userStatus}
            />

            <Provide
                poolAddress={poolAddress}
                user={user}
                rewarded={isRewardedNegative ? new BigNumber(0) : userRewardedBalance}
                status={userStatus}
                pairBalanceESD={pairBalanceESD}
                pairBalanceUSDC={pairBalanceUSDC}
                userUSDCBalance={userUSDCBalance}
                userUSDCAllowance={userUSDCAllowance}
            />
        </>
    )
}

export default Liquidity;