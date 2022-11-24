import BigNumber from 'bignumber.js'

import BalanceBlock from '../../components/common/BalanceBlock'
import TextBlock from '../../components/common/TextBlock'
import { ownership } from '../../utils/number'
import styles from './Pool.module.scss'

type PoolPageHeaderProps = {
    accountUNIBalance: BigNumber
    accountBondedBalance: BigNumber
    accountRewardedESDBalance: BigNumber
    accountClaimableESDBalance: BigNumber
    poolTotalBonded: BigNumber
    accountPoolStatus: number
    unlocked: number
}

const STATUS_MAP = ['Unlocked', 'Locked']

function status(accountStatus: any, unlocked: any) {
    return (
        STATUS_MAP[accountStatus] +
        (accountStatus === 0 ? '' : ' until ' + unlocked)
    )
}

const PoolPageHeader = ({
    accountUNIBalance,
    accountBondedBalance,
    accountRewardedESDBalance,
    accountClaimableESDBalance,
    poolTotalBonded,
    accountPoolStatus,
    unlocked,
}: PoolPageHeaderProps) => {
    return (
        <div className={styles.header_container}>
            <div className={styles.header_content}>
                <BalanceBlock
                    asset="Balance"
                    balance={accountUNIBalance}
                    suffix={' T-3CRV'}
                />
            </div>
            <div className={styles.header_content}>
                <BalanceBlock
                    asset="Rewarded"
                    balance={accountRewardedESDBalance}
                    suffix={' T'}
                />
            </div>
            <div className={styles.header_content}>
                <BalanceBlock
                    asset="Claimable"
                    balance={accountClaimableESDBalance}
                    suffix={' T'}
                />
            </div>
            <div className={styles.header_content}>
                <BalanceBlock
                    asset="Pool Ownership"
                    balance={ownership(accountBondedBalance, poolTotalBonded)}
                    suffix={'%'}
                />
            </div>
            <div className={styles.header_content}>
                <TextBlock
                    label="Pool Status"
                    text={status(accountPoolStatus, unlocked)}
                />
            </div>
        </div>
    )
}

export default PoolPageHeader
