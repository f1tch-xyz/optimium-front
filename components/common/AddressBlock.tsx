import Chip from '@mui/material/Chip';
import React from 'react';

type AddressBlockProps = {
    label: string,
    address: string
}

function AddressBlock({ label, address }: AddressBlockProps) {
    return (
        <>
            <div style={{ fontSize: 16, padding: 3 }}>{label}</div>
            <div style={{ padding: 5 }}>
                <Chip label={address} variant="outlined" />
            </div>
        </>
    );
}

export default AddressBlock;
