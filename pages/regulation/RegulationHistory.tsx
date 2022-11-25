import React, { useEffect, useState } from 'react'

import { getAllRegulations, getEpoch, getTotalDebt } from '../../utils/infura'
import { ESD, ESDS } from '../../constants/tokens'
import { formatBN, toTokenUnitsBN } from '../../utils/number'
import BigNumber from 'bignumber.js'
import styles from './Regulation.module.scss'
import { parseEther } from 'ethers/lib/utils'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box'

type RegulationHistoryProps = {
    user: string
}

type Regulation = {
    type: string
    data: RegulationEntry
    bootstrap?: true
    totalDebt?: BigNumber
}

type RegulationEntry = {
    epoch: BigNumber
    price: BigNumber
    deltaRedeemable: BigNumber
    deltaDebt: BigNumber
    deltaBonded: BigNumber
}

function formatPrice(type: any, data: any) {
    if (type === 'INCREASE') {
        return `+${formatBN(
            toTokenUnitsBN(data.price.sub('978297737593846773'), ESD.decimals),
            3
        )}`
    }

    if (type === 'DECREASE') {
        return `${formatBN(
            toTokenUnitsBN(data.price.sub('978297737593846773'), ESD.decimals),
            3
        )}`
    }

    return type === 'NEUTRAL'
        ? '+0.000'
        : formatBN(toTokenUnitsBN(data.price, ESD.decimals), 3)
}

function formatDeltaRedeemable(type: any, data: any) {
    return type === 'INCREASE'
        ? '+' + formatBN(toTokenUnitsBN(data.newRedeemable, ESD.decimals), 2)
        : '+0.00'
}

function formatDeltaDebt(type: any, data: any, totalDebt: any) {
    if (totalDebt?.isZero()) {
        return '0.00'
    }
    return type === 'INCREASE'
        ? '-' + formatBN(toTokenUnitsBN(data.lessDebt, ESD.decimals), 2)
        : type === 'DECREASE'
            ? '+' + formatBN(toTokenUnitsBN(data.newDebt, ESD.decimals), 2)
            : '+0.00'
}

function formatDeltaBonded(type: any, data: any) {
    return type === 'INCREASE'
        ? '+' + formatBN(toTokenUnitsBN(data.newBonded, ESD.decimals), 2)
        : '+0.00'
}

function renderEntry({ type, data, totalDebt }: Regulation): any {
    return {
        id: uuidv4(),
        epoch: data.epoch.toString(),
        price: formatPrice(type, data),
        deltaRedeemable: formatDeltaRedeemable(type, data),
        deltaDebt: formatDeltaDebt(type, data, totalDebt),
        deltaBonded: formatDeltaBonded(type, data)
    }
}

function RegulationHistory({ user }: RegulationHistoryProps) {
    const [epoch, setEpoch] = useState(0)
    const [regulations, setRegulations] = useState<Regulation[]>([]);
    const [rows, setRows] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [initialized, setInitialized] = useState(false)

    //Update User balances
    useEffect(() => {
        let isCancelled = false

        async function updateUserInfo() {
            const [allRegulations, totalDebt] = await Promise.all([
                getAllRegulations(ESDS.addr),
                getTotalDebt(ESDS.addr)
            ]);

            if (!isCancelled) {
                setRegulations(allRegulations.map((reg: any) => {
                    if (reg.data.epoch.gte(672)) {
                        reg.bootstrap = true
                        reg.totalDebt = totalDebt
                    }
                    return reg;
                }));
                setInitialized(true);
            }
        }


        updateUserInfo();
        setRows(regulations.map((reg: any) => renderEntry(reg)))

        // setRows(regulations.map((reg: any) => renderEntry(reg)))
        const id = setInterval(updateUserInfo, 15000)

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
            clearInterval(id);
        }
    }, [initialized]);

    const columns: GridColDef[] = [
        { field: 'epoch', headerName: 'Epoch', flex: 1 },
        { field: 'price', headerName: 'Price', flex: 1 },
        { field: 'deltaRedeemable', headerName: 'Redeemable', flex: 1 },
        { field: 'deltaDebt', headerName: 'Debt', flex: 1 },
        { field: 'deltaBonded', headerName: 'Bonded', flex: 1 },
    ];

    return (
        <Box border={'1px solid black'} className={styles.box_custom_style}>
            <Box px={2} height={32} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'} borderBottom={'1px solid black'}>
                HISTORY
            </Box>
            <Box px={2}>
                <div style={{ height: 635, width: '100%' }}>
                    <DataGrid
                        loading={!initialized}
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </div>
            </Box>
        </Box>
    )
}

export default RegulationHistory
