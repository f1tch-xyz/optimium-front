import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import NumberBlock from '../../components/common/NumberBlock'
import { ESDS } from '../../constants/tokens'
import { advance } from '../../utils/web'
import styles from './EpochDetail.module.scss'

type AdvanceEpochProps = {
    user: string
    epoch: number
    epochTime: number
}

function AdvanceEpoch({ user, epoch, epochTime }: AdvanceEpochProps) {
    return (
        <Box height={125} border={'1px solid black'} className={styles.box_custom_style}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                ADVANCE EPOCH
            </Box>
            <Box px={2}>
                <div style={{ display: 'flex' }}>
                    {/* Epoch Time */}
                    <div style={{ width: '30%' }}>
                        <NumberBlock title="Epoch (from current time)" num={epochTime} />
                    </div>
                    {/* Advance Epoch */}
                    <div style={{ width: '40%' }} />
                    <div style={{ width: '30%', paddingTop: '2%' }}>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                                advance(ESDS.addr)
                            }}>
                            Advance
                        </Button>
                    </div>
                </div>
            </Box>
        </Box>
    )
}

export default AdvanceEpoch
