import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';

function MaxButton({ onClick }: { onClick: Function }) {
    return (
        <>
            {/* <Button sx={{ padding: 0, border: 'none!important' }} onClick={() => onClick}> */}
            <Box pt={1}>
                <span onClick={() => onClick} style={{ opacity: 0.5, cursor: 'pointer' }}> Max </span>
            </Box>
            {/* </Button> */}
        </>
    );
}

export default MaxButton;
