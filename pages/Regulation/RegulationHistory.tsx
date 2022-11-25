import React, { useEffect, useState } from 'react'

import { getAllRegulations, getEpoch, getTotalDebt } from '../../utils/infura'
import { ESD, ESDS } from '../../constants/tokens'
import { formatBN, toTokenUnitsBN } from '../../utils/number'
import BigNumber from 'bignumber.js'
import styles from './Regulation.module.scss'
import { parseEther } from 'ethers/lib/utils'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { uuid } from 'uuidv4';

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
        id: uuid(),
        epoch: data.epoch.toString(),
        price: formatPrice(type, data),
        deltaRedeemable: formatDeltaRedeemable(type, data),
        deltaDebt: formatDeltaDebt(type, data, totalDebt),
        deltaBonded: formatDeltaBonded(type, data)
    }
}

function RegulationHistory({ user }: RegulationHistoryProps) {
    const [epoch, setEpoch] = useState(0)
    const [regulations, setRegulations] = useState<Regulation[]>([])
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

        setRows(regulations.map((reg: any) => renderEntry(reg)));

        updateUserInfo()
        const id = setInterval(updateUserInfo, 15000)

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true
            clearInterval(id)
        }
    }, []);

    const columns: GridColDef[] = [
        { field: 'epoch', headerName: 'Epoch', minWidth: 150 },
        { field: 'price', headerName: 'Price', minWidth: 150 },
        { field: 'deltaRedeemable', headerName: 'Redeemable', minWidth: 150 },
        { field: 'deltaDebt', headerName: 'Debt', minWidth: 150 },
        { field: 'deltaBonded', headerName: 'Bonded', minWidth: 150 },
    ];

    return (
        <div
            className={styles.data_view}>
            Regulation History
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    loading={!initialized}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </div>
    )
}

export default RegulationHistory
