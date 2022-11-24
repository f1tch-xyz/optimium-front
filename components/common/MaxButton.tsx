import Button from '@mui/material/Button';
import React from 'react';

function MaxButton({ onClick }: { onClick: Function }) {
    return (
        <div style={{ padding: 3 }}>
            <Button onClick={() => onClick}>
                <span style={{ opacity: 0.5 }}> Max </span>
            </Button>
        </div>
    );
}

export default MaxButton;
