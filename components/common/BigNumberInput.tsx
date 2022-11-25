import React from 'react';

import BigNumber from 'bignumber.js';
import { Box, TextField } from '@mui/material';

type BigNumberInputProps = {
    value: BigNumber,
    setter: (value: BigNumber) => void
    adornment?: any,
    disabled?: boolean
}

function BigNumberInput({ value, setter, adornment, disabled = false }: BigNumberInputProps) {
    return (
        <>
            <Box pr={2}>
                <TextField
                    size='small'
                    type="number"
                    value={value.isNegative() ? '' : value.toFixed()}
                    onChange={(event) => {
                        if (event.target.value) {
                            setter(new BigNumber(event.target.value));
                        } else {
                            setter(new BigNumber(-1));
                        }
                    }}
                    onBlur={() => {
                        if (value.isNegative()) {
                            setter(new BigNumber(0))
                        }
                    }}
                    disabled={disabled}
                />
            </Box>
        </>
    );
}

export default BigNumberInput;
