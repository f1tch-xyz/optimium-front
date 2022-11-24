import React, { useEffect, useState } from 'react'

import { getAllRegulations, getEpoch, getTotalDebt } from '../../utils/infura'
import { ESD, ESDS } from '../../constants/tokens'
import { formatBN, toTokenUnitsBN } from '../../utils/number'
import BigNumber from 'bignumber.js'
import styles from './Regulation.module.scss'
import { parseEther } from 'ethers/lib/utils'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

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
    // console.log(
    //   data.epoch.toString(),
    //   data.price.toString(),
    //   data.price.sub('978297737593846773').toString(),
    //   console.log(data.lessDebt.toString())
    // )
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

function renderEntry({ type, data, totalDebt }: Regulation): string[] {
    return [
        data.epoch.toString(),
        formatPrice(type, data),
        formatDeltaRedeemable(type, data),
        formatDeltaDebt(type, data, totalDebt),
        formatDeltaBonded(type, data),
    ]
}

function RegulationHistory({ user }: RegulationHistoryProps) {
    const [epoch, setEpoch] = useState(0)
    const [regulations, setRegulations] = useState<Regulation[]>([])
    const [page, setPage] = useState(0)
    const [initialized, setInitialized] = useState(false)

    //Update User balances
    useEffect(() => {
        let isCancelled = false

        async function updateUserInfo() {
            const [
                allRegulations,
                totalDebt,
                // epoch
            ] = await Promise.all([
                getAllRegulations(ESDS.addr),
                getTotalDebt(ESDS.addr),
                // getEpoch(ESDS.addr),
            ])

            console.log('allRegulations', allRegulations);
            console.log('totalDebt', totalDebt);


            if (!isCancelled) {
                setRegulations(
                    allRegulations.map((reg: any, index: any) => {
                        if (reg.data.epoch.gte(672)) {
                            reg.id = index
                            reg.bootstrap = true
                            reg.totalDebt = totalDebt
                        }
                        return reg
                    })
                )

                setInitialized(true)
            }

            console.log('regulations', regulations);

        }

        updateUserInfo()
        const id = setInterval(updateUserInfo, 15000)



        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true
            clearInterval(id)
        }
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'data.epoch', headerName: 'Epoch', width: 120, valueGetter: (params: GridValueGetterParams) => {
                return params.row.data[0].toString()
            }
        },
        {
            field: 'data.peg', headerName: 'Peg', width: 200, valueGetter: (params: GridValueGetterParams) => {
                // return params.row.data.newDebt.toString()
                return params.row.data[1].toString()
            }
        },
        {
            field: 'data.redeemable', headerName: 'Redeemable', width: 120, valueGetter: (params: GridValueGetterParams) => {
                return params.row.data[2].toString()
            }
        },
        {
            field: 'data.price', headerName: 'Price', width: 120, valueGetter: (params: GridValueGetterParams) => {
                return params.row.data.price.toString()
            }
        },
        {
            field: 'data.totalDebt', headerName: 'Price', width: 120, valueGetter: (params: GridValueGetterParams) => {
                return params.row.totalDebt.toString()
            }
        }
    ];

    return (
        <div
            className={styles.data_view}>

            {initialized ? 'default' : 'loading'}
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    rows={regulations}
                    loading={!initialized}
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    checkboxSelection
                />
            </div>
        </div>
    )
}

export default RegulationHistory
