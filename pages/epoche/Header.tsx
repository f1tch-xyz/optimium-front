import React from 'react'
import NumberBlock from '../../components/common/NumberBlock'
import TextBlock from '../../components/common/TextBlock'

type AccountPageHeaderProps = {
    epoch: number
    epochTime: number
}

const EpochPageHeader = ({ epoch, epochTime }: AccountPageHeaderProps) => (
    <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '25%' }}>
            <NumberBlock title="Current" num={epoch} />
        </div>
        <div style={{ width: '25%' }}>
            <NumberBlock title="Available" num={epochTime} />
        </div>
        <div style={{ width: '25%' }}>
            <TextBlock label="Epoch duration" text="30 minutes" />
        </div>
    </div>
)

export default EpochPageHeader
