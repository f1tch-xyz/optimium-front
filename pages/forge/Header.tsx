import BigNumber from 'bignumber.js';
import { BalanceBlock } from '../../components/common';
import TextBlock from '../../components/common/TextBlock';
import { ownership } from '../../utils/number';
import styles from './Wallet.module.scss';

type AccountPageHeaderProps = {
    accountESDBalance: BigNumber
    accountESDSBalance: BigNumber
    totalESDSSupply: BigNumber
    accountStagedBalance: BigNumber
    accountBondedBalance: BigNumber
    accountStatus: number
    unlocked: number
}

const STATUS_MAP = ['Unlocked', 'Locked', 'Locked']

function status(accountStatus: any, unlocked: any) {
    return (
        STATUS_MAP[accountStatus] +
        (accountStatus === 0 ? '' : ' until ' + unlocked)
    )
}

const AccountPageHeader = ({
    accountESDBalance,
    accountESDSBalance,
    totalESDSSupply,
    accountStagedBalance,
    accountBondedBalance,
    accountStatus,
    unlocked,
}: AccountPageHeaderProps) => (
    <div className={styles.header_container}>
        <div className={styles.header_content}>
            <BalanceBlock asset="Balance" balance={accountESDBalance} suffix={' T'} />
        </div>
        <div className={styles.header_content}>
            <BalanceBlock
                asset="Staged"
                balance={accountStagedBalance}
                suffix={' T'}
            />
        </div>
        <div className={styles.header_content}>
            <BalanceBlock
                asset="Bonded"
                balance={accountBondedBalance}
                suffix={' T'}
            />
        </div>
        <div className={styles.header_content}>
            <BalanceBlock
                asset="Bond Ownership"
                balance={ownership(accountESDSBalance, totalESDSSupply)}
                suffix={'%'}
            />
        </div>
        <div className={styles.header_content}>
            <TextBlock label="Status" text={status(accountStatus, unlocked)} />
        </div>
    </div>
)

export default AccountPageHeader
